import { Test, TestingModule } from '@nestjs/testing';
import { PollingService } from '../polling.service';
import { getModelToken } from '@nestjs/mongoose';
import { Polling } from '../schemas/polling.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('PollingService', () => {
  let service: PollingService;
  let pollModel: any;

  const mockPoll = {
    _id: new Types.ObjectId(),
    title: 'Test Poll',
    description: 'Test Description',
    options: [
      { id: 'opt1', text: 'Option 1', votes: [] },
      { id: 'opt2', text: 'Option 2', votes: [] },
    ],
    visibility: 'public',
    createdBy: new Types.ObjectId(),
    allowedUsers: [],
    duration: 60,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    votes: [],
    isActive: true,
    save: jest.fn(),
  };

  const mockUser = {
    sub: '507f1f77bcf86cd799439011',
    email: 'admin@test.com',
    role: 'admin',
  };

  beforeEach(async () => {
    const mockPollModel = {
      new: jest.fn().mockImplementation(() => mockPoll),
      constructor: jest.fn().mockImplementation(() => mockPoll),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      updateMany: jest.fn(),
      save: jest.fn(),
      exec: jest.fn(),
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollingService,
        {
          provide: getModelToken(Polling.name),
          useValue: mockPollModel,
        },
      ],
    }).compile();

    service = module.get<PollingService>(PollingService);
    pollModel = module.get(getModelToken(Polling.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a public poll successfully', async () => {
      const createPollDto = {
        title: 'Test Poll',
        description: 'Test Description',
        options: [{ text: 'Option 1' }, { text: 'Option 2' }],
        visibility: 'public' as const,
        duration: 60,
      };

      pollModel.new.mockReturnValue(mockPoll);
      mockPoll.save.mockResolvedValue(mockPoll);

      const result = await service.create(createPollDto, mockUser);

      expect(result).toEqual(mockPoll);
      expect(mockPoll.save).toHaveBeenCalled();
    });

    it('should throw error for private poll without allowed users', async () => {
      const createPollDto = {
        title: 'Test Poll',
        description: 'Test Description',
        options: [{ text: 'Option 1' }, { text: 'Option 2' }],
        visibility: 'private' as const,
        duration: 60,
        allowedUserIds: [],
      };

      await expect(service.create(createPollDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('vote', () => {
    it('should allow voting on active poll', async () => {
      const pollId = mockPoll._id.toString();
      const voteDto = { optionId: 'opt1' };

      pollModel.findById.mockResolvedValue(mockPoll);
      mockPoll.save.mockResolvedValue(mockPoll);

      const result = await service.vote(pollId, voteDto, mockUser);

      expect(result).toEqual(mockPoll);
      expect(mockPoll.options[0].votes).toContain(mockUser.sub);
    });

    it('should throw error for duplicate voting', async () => {
      const pollId = mockPoll._id.toString();
      const voteDto = { optionId: 'opt1' };

      // Simulate user already voted
      mockPoll.votes = [
        {
          userId: new Types.ObjectId(mockUser.sub),
          optionId: 'opt1',
          votedAt: new Date(),
        },
      ];

      pollModel.findById.mockResolvedValue(mockPoll);

      await expect(service.vote(pollId, voteDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error for invalid option ID', async () => {
      const pollId = mockPoll._id.toString();
      const voteDto = { optionId: 'invalid-option' };

      pollModel.findById.mockResolvedValue(mockPoll);

      await expect(service.vote(pollId, voteDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return poll for authorized user', async () => {
      const pollId = mockPoll._id.toString();

      pollModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPoll),
      });

      const result = await service.findOne(pollId, mockUser);

      expect(result).toEqual(mockPoll);
    });

    it('should throw error for non-existent poll', async () => {
      const pollId = new Types.ObjectId().toString();

      pollModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne(pollId, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
