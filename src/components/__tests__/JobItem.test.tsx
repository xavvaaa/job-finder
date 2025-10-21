import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import JobItem from '../JobItem';
import { Job } from '../../types/Job';

// Mock contexts
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

jest.mock('../../contexts/JobContext', () => ({
  useJobContext: () => ({
    appliedJobs: [],
    applyForJob: jest.fn(),
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

describe('JobItem Component', () => {
  const mockJob: Job = {
    id: '1',
    title: 'Software Engineer',
    company: 'Tech Company',
    logo: 'https://example.com/logo.png',
    salary: 75000,
    minSalary: 70000,
    maxSalary: 80000,
    salaryText: '$70,000 - $80,000',
    description: 'Great job opportunity',
    location: 'San Francisco, CA',
  };

  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render job information correctly', () => {
    const { getByText } = render(
      <JobItem job={mockJob} onSave={mockOnSave} isSaved={false} />
    );

    expect(getByText('Software Engineer')).toBeTruthy();
    expect(getByText('Tech Company')).toBeTruthy();
    expect(getByText('$70,000 - $80,000')).toBeTruthy();
    expect(getByText('San Francisco, CA')).toBeTruthy();
  });

  it('should call onSave when save button is pressed', () => {
    const { getByText } = render(
      <JobItem job={mockJob} onSave={mockOnSave} isSaved={false} />
    );

    const saveButton = getByText('Save');
    fireEvent.press(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('should show "Saved" when job is saved', () => {
    const { getByText } = render(
      <JobItem job={mockJob} onSave={mockOnSave} isSaved={true} />
    );

    expect(getByText('Saved')).toBeTruthy();
  });

  it('should not show buttons when hideButtons is true', () => {
    const { queryByText } = render(
      <JobItem
        job={mockJob}
        onSave={mockOnSave}
        isSaved={false}
        hideButtons={true}
      />
    );

    expect(queryByText('Save')).toBeNull();
    expect(queryByText('Apply')).toBeNull();
  });

  it('should display company initial when logo fails to load', () => {
    const jobWithoutLogo = { ...mockJob, logo: undefined };
    const { getByText } = render(
      <JobItem job={jobWithoutLogo} onSave={mockOnSave} isSaved={false} />
    );

    expect(getByText('T')).toBeTruthy(); // First letter of "Tech Company"
  });

  it('should show Apply button for unapplied jobs', () => {
    const { getByText } = render(
      <JobItem job={mockJob} onSave={mockOnSave} isSaved={false} />
    );

    expect(getByText('Apply')).toBeTruthy();
  });
});
