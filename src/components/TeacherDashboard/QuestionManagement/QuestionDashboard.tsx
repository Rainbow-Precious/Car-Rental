import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Mock data
const questionStats = {
  total: 172,
  byType: [
    { type: 'Multiple Choice', count: 98, color: 'from-blue-500 to-blue-600' },
    { type: 'True/False', count: 34, color: 'from-green-500 to-green-600' },
    { type: 'Essay', count: 25, color: 'from-purple-500 to-purple-600' },
    { type: 'Short Answer', count: 15, color: 'from-pink-500 to-pink-600' },
  ],
  bySubject: [
    { subject: 'Mathematics', count: 45, color: 'from-red-500 to-red-600' },
    { subject: 'Science', count: 38, color: 'from-blue-500 to-blue-600' },
    { subject: 'English', count: 32, color: 'from-green-500 to-green-600' },
    { subject: 'History', count: 28, color: 'from-yellow-500 to-yellow-600' },
    { subject: 'Geography', count: 19, color: 'from-purple-500 to-purple-600' },
    { subject: 'Others', count: 10, color: 'from-gray-500 to-gray-600' },
  ],
  recentActivity: [
    { id: 1, action: 'Created new question', questionType: 'Multiple Choice', subject: 'Mathematics', date: '1 hour ago' },
    { id: 2, action: 'Updated question', questionType: 'Essay', subject: 'English', date: '3 hours ago' },
    { id: 3, action: 'Created new question', questionType: 'True/False', subject: 'Science', date: '1 day ago' },
    { id: 4, action: 'Created new question', questionType: 'Short Answer', subject: 'History', date: '1 day ago' },
  ]
};

// Interfaces for exam creation
interface ExamFormData {
  title: string;
  description: string;
  classId: string;
  armId: string;
  numberOfPapers: number;
  totalDurationInMinutes: number;
  passMark: number;
  startTime: string;
  endTime: string;
  questionType: number;
  totalPoints: number;
}

// New interface for exam paper
interface ExamPaperFormData {
  id?: string;
  examSessionId: string;
  subjectName: string;
  passMarkForThisPaper: number;
  totalTimeForThisPaperInMinutes: number;
  presentationType: number;
  defaultTimePerQuestionInMinutes: number;
}

// New interface for question
interface QuestionFormData {
  examPaperId: string;
  questionText: string;
  questionType: number;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer: string;
  points: number;
  timeInMinutes?: number;
}

interface AddedQuestion {
  id: string;
  questionText: string;
  questionType: number;
  points: number;
  examPaperId: string;
}

// Step management
interface ExamCreationStep {
  step: number;
  title: string;
  description: string;
  completed: boolean;
}

interface CreatedExamSession {
  id: string;
  title: string;
  numberOfPapers: number;
  className: string;
  armName: string;
}

interface Class {
  classId: string;
  className: string;
  campusId: string;
  campusName: string;
  arms: {
    armId: string;
    armName: string;
  }[];
}

interface Campus {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
  email: string;
  capacity: number;
  isActive: boolean;
  studentCount: number;
  teacherCount: number;
}

const QuestionDashboard: React.FC = () => {
  // Exam creation states
  const [showExamModal, setShowExamModal] = useState(false);
  const [examLoading, setExamLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [examForm, setExamForm] = useState<ExamFormData>({
    title: '',
    description: '',
    classId: '',
    armId: '',
    numberOfPapers: 1,
    totalDurationInMinutes: 90,
    passMark: 60,
    startTime: '',
    endTime: '',
    questionType: 1,
    totalPoints: 0
  });

  // Error display states
  const [formError, setFormError] = useState<{
    title: string;
    message: string;
    suggestion: string;
    type: 'error' | 'warning' | 'info';
  } | null>(null);
  const [paperError, setPaperError] = useState<{
    title: string;
    message: string;
    suggestion: string;
    type: 'error' | 'warning' | 'info';
  } | null>(null);

  // Step workflow states
  const [currentStep, setCurrentStep] = useState(1);
  const [createdExamSession, setCreatedExamSession] = useState<CreatedExamSession | null>(null);
  const [steps, setSteps] = useState<ExamCreationStep[]>([
    { step: 1, title: 'Create Exam Session', description: 'Set up basic exam details', completed: false },
    { step: 2, title: 'Add Exam Papers', description: 'Add subject papers to your exam', completed: false },
    { step: 3, title: 'Add Questions', description: 'Add questions to each paper', completed: false },
    { step: 4, title: 'Review & Finalize', description: 'Review and finalize your exam', completed: false }
  ]);

  // Paper creation states
  const [paperLoading, setPaperLoading] = useState(false);
  const [currentPaperIndex, setCurrentPaperIndex] = useState(0);
  const [addedPapers, setAddedPapers] = useState<ExamPaperFormData[]>([]);
  const [paperForm, setPaperForm] = useState<ExamPaperFormData>({
    examSessionId: '',
    subjectName: '',
    passMarkForThisPaper: 60,
    totalTimeForThisPaperInMinutes: 60,
    presentationType: 1,
    defaultTimePerQuestionInMinutes: 2
  });

  // Question creation states
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<ExamPaperFormData | null>(null);
  const [addedQuestions, setAddedQuestions] = useState<AddedQuestion[]>([]);
  const [questionForm, setQuestionForm] = useState<QuestionFormData>({
    examPaperId: '',
    questionText: '',
    questionType: 1,
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    points: 5,
    timeInMinutes: 2
  });

  // Fetch classes and campuses when component mounts
  useEffect(() => {
    if (showExamModal) {
      // Clear any existing errors when modal opens
      setFormError(null);
      setPaperError(null);
      fetchClassesAndCampuses();
    }
  }, [showExamModal]);

  const fetchClassesAndCampuses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      // Fetch classes with arms
      const classesResponse = await axios.get('http://159.65.31.191/api/Class/all-with-arms', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });

      // Fetch campuses
      const campusesResponse = await axios.get('http://159.65.31.191/api/Tenant/campuses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });

      if (classesResponse.data.statusCode === 200) {
        setClasses(classesResponse.data.data || []);
      }

      if (campusesResponse.data.statusCode === 200) {
        setCampuses(campusesResponse.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleExamFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExamForm(prev => ({
      ...prev,
      [name]: name === 'numberOfPapers' || name === 'totalDurationInMinutes' || name === 'passMark' || name === 'questionType' || name === 'totalPoints' 
        ? parseInt(value) || 0 
        : value
    }));

    // Reset armId when classId changes
    if (name === 'classId') {
      setExamForm(prev => ({ ...prev, armId: '' }));
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setExamLoading(true);
    
    // Clear any existing errors when starting new request
    setFormError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      // Validate required fields
      if (!examForm.title || !examForm.classId || !examForm.armId || !examForm.startTime || !examForm.endTime) {
        toast.error('Please fill in all required fields');
        setExamLoading(false);
        return;
      }

      // Convert datetime strings to UTC format for PostgreSQL
      const requestData = {
        ...examForm,
        startTime: new Date(examForm.startTime).toISOString(), // Converts to UTC with 'Z'
        endTime: new Date(examForm.endTime).toISOString()       // Converts to UTC with 'Z'
      };

      // Log the request data being sent
      console.log('🚀 CREATING EXAM SESSION');
      console.log('📤 Request URL:', 'http://159.65.31.191/api/Tenant/exam-session');
      console.log('🔑 Token Info:');
      console.log('   - Token exists:', !!token);
      console.log('   - Token length:', token.length);
      console.log('   - Token start:', token.substring(0, 30));
      console.log('   - Token end:', '...' + token.substring(token.length - 20));
      console.log('📤 Request Headers:', {
        'Authorization': `Bearer ${token.substring(0, 20)}...`, // Only show first 20 chars for security
        'Content-Type': 'application/json',
        'accept': 'application/json'
      });
      console.log('📤 Original Form Data:', JSON.stringify(examForm, null, 2));
      console.log('📤 Converted Request Data:', JSON.stringify(requestData, null, 2));

      const response = await axios.post(
        'http://159.65.31.191/api/Tenant/exam-session',
        requestData, // Send the converted data instead of examForm
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          }
        }
      );

      // Log the full response
      console.log('📥 RESPONSE RECEIVED');
      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Headers:', response.headers);
      console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));

      if (response.status === 200 || response.status === 201) {
        // Enhanced success message with details
        const selectedClass = classes.find(cls => cls.classId === examForm.classId);
        const selectedArm = selectedClass?.arms.find(arm => arm.armId === examForm.armId);
        
        toast.success(
          `✅ Exam "${examForm.title}" created successfully!\n` +
          `📚 Class: ${selectedClass?.className} - ${selectedArm?.armName}\n` +
          `⏱️ Duration: ${examForm.totalDurationInMinutes} minutes\n` +
          `🎯 Pass Mark: ${examForm.passMark}%`,
          {
            duration: 6000, // Show for 6 seconds
            style: {
              background: '#10B981',
              color: 'white',
              fontWeight: 'bold',
              padding: '16px',
              borderRadius: '8px'
            }
          }
        );

        console.log('✅ SUCCESS: Exam session created successfully!');
        console.log('🆔 Exam Session ID:', response.data.data);

        // Reset form for next step but KEEP MODAL OPEN
        setExamForm({
          title: '',
          description: '',
          classId: '',
          armId: '',
          numberOfPapers: 1,
          totalDurationInMinutes: 90,
          passMark: 60,
          startTime: '',
          endTime: '',
          questionType: 1,
          totalPoints: 0
        });

        // Move to next step and mark step 1 as complete
        setSteps(prev => prev.map(step => 
          step.step === 1 ? { ...step, completed: true } : step
        ));
        setCurrentStep(2);
        
        // Set exam session data for step 2
        setCreatedExamSession({
          id: response.data.data,
          title: examForm.title,
          numberOfPapers: examForm.numberOfPapers,
          className: selectedClass?.className || '',
          armName: selectedArm?.armName || ''
        });
        
        // Initialize paper form with exam session ID
        setPaperForm({
          examSessionId: response.data.data,
          subjectName: '',
          passMarkForThisPaper: 60,
          totalTimeForThisPaperInMinutes: 60,
          presentationType: 1,
          defaultTimePerQuestionInMinutes: 2
        });
      }
    } catch (error: any) {
      // Enhanced error logging
      console.error('❌ ERROR CREATING EXAM SESSION');
      console.error('❌ Error Details:', error);
      
      if (error.response) {
        console.error('📥 Error Response Status:', error.response.status);
        console.error('📥 Error Response Headers:', error.response.headers);
        console.error('📥 Error Response Data:', JSON.stringify(error.response.data, null, 2));
        
        // Extract comprehensive error information
        const errorData = error.response.data;
        const statusCode = error.response.status;
        const statusText = error.response.statusText;
        
        let errorMessage = '';
        let errorTitle = '';
        
        // Determine error title based on status code
        switch (statusCode) {
          case 400:
            errorTitle = '❌ Invalid Request';
            break;
          case 401:
            errorTitle = '🔒 Authentication Failed';
            break;
          case 403:
            errorTitle = '🚫 Permission Denied';
            break;
          case 404:
            errorTitle = '🔍 Not Found';
            break;
          case 409:
            errorTitle = '⚠️ Conflict Detected';
            break;
          case 422:
            errorTitle = '📝 Validation Failed';
            break;
          case 500:
            errorTitle = '💥 Server Error';
            break;
          default:
            errorTitle = `❌ Error ${statusCode}`;
        }
        
        // Extract error messages
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
        
        // Handle validation errors array
        if (errorData?.errors) {
          if (Array.isArray(errorData.errors)) {
            errorMessage += '\n\nValidation Errors:\n• ' + errorData.errors.join('\n• ');
          } else if (typeof errorData.errors === 'object') {
            // Handle field-specific errors
            const fieldErrors = Object.entries(errorData.errors)
              .map(([field, messages]) => {
                if (Array.isArray(messages)) {
                  return `${field}: ${messages.join(', ')}`;
                }
                return `${field}: ${messages}`;
              });
            errorMessage += '\n\nField Errors:\n• ' + fieldErrors.join('\n• ');
          }
        }
        
        // Handle additional error details
        if (errorData?.details) {
          errorMessage += '\n\nDetails: ' + errorData.details;
        }
        
        // Handle title/type from some API responses
        if (errorData?.title && errorData.title !== errorData.message) {
          errorMessage += '\n\nType: ' + errorData.title;
        }
        
        // Add helpful suggestions based on common errors
        let suggestion = '';
        if (errorMessage.toLowerCase().includes('past')) {
          suggestion = '\n\n💡 Tip: Please select a future date and time for your exam.';
        } else if (errorMessage.toLowerCase().includes('conflict')) {
          suggestion = '\n\n💡 Tip: Try a different time slot or check existing exams.';
        } else if (errorMessage.toLowerCase().includes('class') || errorMessage.toLowerCase().includes('arm')) {
          suggestion = '\n\n💡 Tip: Ensure you have selected valid class and arm.';
        } else if (errorMessage.toLowerCase().includes('permission') || errorMessage.toLowerCase().includes('forbidden')) {
          suggestion = '\n\n💡 Tip: Check if you have permission to create exams for this class.';
        } else if (errorMessage.toLowerCase().includes('token') || errorMessage.toLowerCase().includes('unauthorized')) {
          suggestion = '\n\n💡 Tip: Please try logging in again.';
        }
        
        // Fallback message if no specific message found
        if (!errorMessage.trim()) {
          errorMessage = `HTTP ${statusCode}: ${statusText}`;
        }
        
        // Display beautiful error toast
        toast.error(
          `${errorTitle}\n\n${errorMessage}${suggestion}`,
          {
            duration: 10000, // Show longer for errors
            style: {
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: 'white',
              fontWeight: 'bold',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #FCA5A5',
              maxWidth: '500px',
              fontSize: '14px',
              lineHeight: '1.5',
              boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.3), 0 10px 10px -5px rgba(239, 68, 68, 0.2)'
            }
          }
        );
        
        // Set form error state for COMPULSORY INLINE DISPLAY
        setFormError({
          title: errorTitle,
          message: errorMessage,
          suggestion: suggestion.replace('\n\n💡 Tip: ', ''),
          type: 'error'
        });
        
        // Log formatted error for debugging
        console.error(`${errorTitle}: ${errorMessage}`);
        
      } else if (error.request) {
        console.error('📡 Network Error - No response received:', error.request);
        toast.error(
          '📡 Network Connection Error\n\nUnable to reach the server. Please check your internet connection and try again.',
          {
            duration: 8000,
            style: {
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: 'white',
              fontWeight: 'bold',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #FCD34D'
            }
          }
        );
        
        // Set form error state for COMPULSORY INLINE DISPLAY
        setFormError({
          title: '📡 Network Connection Error',
          message: 'Unable to reach the server. Please check your internet connection and try again.',
          suggestion: 'Check your internet connection and try again.',
          type: 'error'
        });
        
      } else {
        console.error('⚠️ Request Setup Error:', error.message);
        toast.error(
          `⚠️ Request Configuration Error\n\n${error.message}\n\n💡 Tip: Please refresh the page and try again.`,
          {
            duration: 8000,
            style: {
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              color: 'white',
              fontWeight: 'bold',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #C4B5FD'
            }
          }
        );
        
        // Set form error state for COMPULSORY INLINE DISPLAY
        setFormError({
          title: '⚠️ Request Configuration Error',
          message: error.message,
          suggestion: 'Please refresh the page and try again.',
          type: 'error'
        });
      }
    } finally {
      setExamLoading(false);
    }
  };

  // Get arms for selected class
  const getArmsForClass = () => {
    const selectedClass = classes.find(cls => cls.classId === examForm.classId);
    return selectedClass?.arms || [];
  };

  // Paper form handling
  const handlePaperFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setPaperForm(prev => {
      const newForm = {
        ...prev,
        [name]: name === 'passMarkForThisPaper' || name === 'totalTimeForThisPaperInMinutes' || name === 'presentationType' || name === 'defaultTimePerQuestionInMinutes'
          ? parseInt(value) || 0 
          : value
      };
      
      // Handle conditional field logic for presentation type
      if (name === 'presentationType') {
        const newPresentationType = parseInt(value);
        if (newPresentationType === 1) {
          // QuestionPreview mode - set default time per question
          newForm.defaultTimePerQuestionInMinutes = 2;
        } else {
          // Other modes - clear time per question as it's not needed
          newForm.defaultTimePerQuestionInMinutes = 0;
        }
      }
      
      return newForm;
    });
  };

  // Add paper to exam session
  const handleAddPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaperLoading(true);
    
    // Clear any existing errors when starting new request
    setPaperError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      // Validate required fields
      if (!paperForm.subjectName || !createdExamSession?.id) {
        toast.error('Please fill in all required fields');
        setPaperLoading(false);
        return;
      }

      // Additional validation for QuestionPreview mode
      if (paperForm.presentationType === 1 && (!paperForm.defaultTimePerQuestionInMinutes || paperForm.defaultTimePerQuestionInMinutes < 1 || paperForm.defaultTimePerQuestionInMinutes > 60)) {
        toast.error('Time per Question is required for QuestionPreview mode (1-60 minutes)');
        setPaperLoading(false);
        return;
      }

      const requestData = {
        examSessionId: createdExamSession.id,
        subjectName: paperForm.subjectName,
        passMarkForThisPaper: paperForm.passMarkForThisPaper,
        totalTimeForThisPaperInMinutes: paperForm.totalTimeForThisPaperInMinutes,
        presentationType: paperForm.presentationType,
        // Always send defaultTimePerQuestionInMinutes (backend validates even when not needed)
        defaultTimePerQuestionInMinutes: paperForm.presentationType === 1 
          ? paperForm.defaultTimePerQuestionInMinutes 
          : 1 // Valid placeholder for non-QuestionPreview modes (won't be used)
      };

      // Log the request data being sent
      console.log('📄 ADDING EXAM PAPER');
      console.log('📤 Request URL:', `http://159.65.31.191/api/Tenant/exam-sessions/${createdExamSession.id}/papers`);
      console.log('🔑 Token Info:');
      console.log('   - Token exists:', !!token);
      console.log('   - Token length:', token.length);
      console.log('📤 Request Headers:', {
        'Authorization': `Bearer ${token.substring(0, 20)}...`,
        'Content-Type': 'application/json'
      });
      console.log('📤 Paper Request Data:', JSON.stringify(requestData, null, 2));

      const response = await axios.post(
        `http://159.65.31.191/api/Tenant/exam-sessions/${createdExamSession.id}/papers`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Log the full response
      console.log('📥 PAPER RESPONSE RECEIVED');
      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));

      if (response.status === 200 || response.status === 201) {
        // Add to added papers list (with complete form data for UI display)
        const paperForUI: ExamPaperFormData = {
          ...paperForm,
          examSessionId: createdExamSession.id
        };
        
        console.log('📝 Adding paper to state with ID:', response.data.data);
        console.log('📝 Paper data being stored:', { ...paperForUI, id: response.data.data });
        
        setAddedPapers(prev => [...prev, { ...paperForUI, id: response.data.data }]);
        
        toast.success(
          `✅ Paper "${paperForm.subjectName}" added successfully!\n` +
          `⏱️ Duration: ${paperForm.totalTimeForThisPaperInMinutes} minutes\n` +
          `🎯 Pass Mark: ${paperForm.passMarkForThisPaper}%`,
          {
            duration: 4000,
            style: {
              background: '#10B981',
              color: 'white',
              fontWeight: 'bold',
              padding: '16px',
              borderRadius: '8px'
            }
          }
        );

        console.log('✅ SUCCESS: Paper added successfully!');
        console.log('📄 Paper ID:', response.data.data);

        // Reset paper form for next paper
        setPaperForm({
          examSessionId: createdExamSession.id,
          subjectName: '',
          passMarkForThisPaper: 60,
          totalTimeForThisPaperInMinutes: 60,
          presentationType: 1,
          defaultTimePerQuestionInMinutes: 2 // Default for QuestionPreview mode
        });

        // Move to next paper or complete step
        if (addedPapers.length + 1 >= createdExamSession.numberOfPapers) {
          // All papers added, mark step as complete and move to questions
          setSteps(prev => prev.map(step => 
            step.step === 2 ? { ...step, completed: true } : step
          ));
          setCurrentStep(3);
          toast.success('🎉 All papers added! Ready to add questions.');
        } else {
          setCurrentPaperIndex(prev => prev + 1);
        }
      }
    } catch (error: any) {
      // Enhanced error logging
      console.error('❌ ERROR ADDING PAPER');
      console.error('❌ Error Details:', error);
      
      if (error.response) {
        console.error('📥 Error Response Status:', error.response.status);
        console.error('📥 Error Response Data:', JSON.stringify(error.response.data, null, 2));
        
        // Extract comprehensive error information
        const errorData = error.response.data;
        const statusCode = error.response.status;
        const statusText = error.response.statusText;
        
        let errorMessage = '';
        let errorTitle = '';
        
        // Determine error title based on status code
        switch (statusCode) {
          case 400:
            errorTitle = '❌ Invalid Paper Data';
            break;
          case 401:
            errorTitle = '🔒 Authentication Failed';
            break;
          case 403:
            errorTitle = '🚫 Permission Denied';
            break;
          case 404:
            errorTitle = '🔍 Exam Session Not Found';
            break;
          case 409:
            errorTitle = '⚠️ Paper Conflict';
            break;
          case 422:
            errorTitle = '📝 Paper Validation Failed';
            break;
          case 500:
            errorTitle = '💥 Server Error';
            break;
          default:
            errorTitle = `❌ Paper Error ${statusCode}`;
        }
        
        // Extract error messages
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
        
        // Handle validation errors array
        if (errorData?.errors) {
          if (Array.isArray(errorData.errors)) {
            errorMessage += '\n\nValidation Errors:\n• ' + errorData.errors.join('\n• ');
          } else if (typeof errorData.errors === 'object') {
            // Handle field-specific errors
            const fieldErrors = Object.entries(errorData.errors)
              .map(([field, messages]) => {
                if (Array.isArray(messages)) {
                  return `${field}: ${messages.join(', ')}`;
                }
                return `${field}: ${messages}`;
              });
            errorMessage += '\n\nField Errors:\n• ' + fieldErrors.join('\n• ');
          }
        }
        
        // Handle additional error details
        if (errorData?.details) {
          errorMessage += '\n\nDetails: ' + errorData.details;
        }
        
        // Handle title/type from some API responses
        if (errorData?.title && errorData.title !== errorData.message) {
          errorMessage += '\n\nType: ' + errorData.title;
        }
        
        // Add helpful suggestions based on common errors
        let suggestion = '';
        if (errorMessage.toLowerCase().includes('subject')) {
          suggestion = '\n\n💡 Tip: Enter a valid subject name (e.g., Mathematics, English).';
        } else if (errorMessage.toLowerCase().includes('time') || errorMessage.toLowerCase().includes('duration')) {
          suggestion = '\n\n💡 Tip: Check time allocation - ensure positive values.';
        } else if (errorMessage.toLowerCase().includes('pass mark') || errorMessage.toLowerCase().includes('percentage')) {
          suggestion = '\n\n💡 Tip: Pass mark should be between 0-100%.';
        } else if (errorMessage.toLowerCase().includes('presentation')) {
          suggestion = '\n\n💡 Tip: Select a valid presentation type.';
        } else if (errorMessage.toLowerCase().includes('exam session') || errorMessage.toLowerCase().includes('not found')) {
          suggestion = '\n\n💡 Tip: The exam session may have been deleted. Please recreate the exam.';
        } else if (errorMessage.toLowerCase().includes('duplicate') || errorMessage.toLowerCase().includes('already exists')) {
          suggestion = '\n\n💡 Tip: This subject may already be added. Try a different subject name.';
        } else if (errorMessage.toLowerCase().includes('permission') || errorMessage.toLowerCase().includes('forbidden')) {
          suggestion = '\n\n💡 Tip: Check if you have permission to add papers to this exam.';
        } else if (errorMessage.toLowerCase().includes('token') || errorMessage.toLowerCase().includes('unauthorized')) {
          suggestion = '\n\n💡 Tip: Please try logging in again.';
        }
        
        // Fallback message if no specific message found
        if (!errorMessage.trim()) {
          errorMessage = `HTTP ${statusCode}: ${statusText}`;
        }
        
        // Display beautiful error toast
        toast.error(
          `${errorTitle}\n\n${errorMessage}${suggestion}`,
          {
            duration: 10000, // Show longer for errors
            style: {
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: 'white',
              fontWeight: 'bold',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #FCA5A5',
              maxWidth: '500px',
              fontSize: '14px',
              lineHeight: '1.5',
              boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.3), 0 10px 10px -5px rgba(239, 68, 68, 0.2)'
            }
          }
        );
        
        // Set form error state for COMPULSORY INLINE DISPLAY
        setPaperError({
          title: errorTitle,
          message: errorMessage,
          suggestion: suggestion.replace('\n\n💡 Tip: ', ''),
          type: 'error'
        });
        
        // Log formatted error for debugging
        console.error(`${errorTitle}: ${errorMessage}`);
        
      } else if (error.request) {
        console.error('📡 Network Error - No response received:', error.request);
        toast.error(
          '📡 Network Connection Error\n\nUnable to reach the server while adding paper. Please check your internet connection and try again.',
          {
            duration: 8000,
            style: {
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: 'white',
              fontWeight: 'bold',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #FCD34D'
            }
          }
        );
        
        // Set paper error state for COMPULSORY INLINE DISPLAY
        setPaperError({
          title: '📡 Network Connection Error',
          message: 'Unable to reach the server while adding paper. Please check your internet connection and try again.',
          suggestion: 'Check your internet connection and try again.',
          type: 'error'
        });
        
      } else {
        console.error('⚠️ Request Setup Error:', error.message);
        toast.error(
          `⚠️ Paper Request Error\n\n${error.message}\n\n💡 Tip: Please try refreshing the page and adding the paper again.`,
          {
            duration: 8000,
            style: {
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              color: 'white',
              fontWeight: 'bold',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #C4B5FD'
            }
          }
        );
        
        // Set paper error state for COMPULSORY INLINE DISPLAY
        setPaperError({
          title: '⚠️ Paper Request Error',
          message: error.message,
          suggestion: 'Please try refreshing the page and adding the paper again.',
          type: 'error'
        });
      }
    } finally {
      setPaperLoading(false);
    }
  };

  // Step management functions
  const resetWorkflow = () => {
    setCurrentStep(1);
    setCreatedExamSession(null);
    setAddedPapers([]);
    setCurrentPaperIndex(0);
    setSteps(prev => prev.map(step => ({ ...step, completed: false })));
    setShowExamModal(false);
    setFormError(null);
    setPaperError(null);
    // Clear question states
    setShowQuestionModal(false);
    setSelectedPaper(null);
    setAddedQuestions([]);
  };

  // Helper function to get status-specific error titles
  const getErrorTitle = (statusCode: number): string => {
    switch (statusCode) {
      case 400: return '❌ Invalid Request';
      case 401: return '🔒 Authentication Failed';
      case 403: return '🚫 Permission Denied';
      case 404: return '🔍 Not Found';
      case 409: return '⚠️ Conflict Detected';
      case 422: return '📝 Validation Failed';
      case 500: return '💥 Server Error';
      default: return `❌ Error ${statusCode}`;
    }
  };

  // Enhanced Error Display Component with Auto-Scroll
  const ErrorDisplay = ({ error, onDismiss }: { 
    error: { title: string; message: string; suggestion: string; type: 'error' | 'warning' | 'info' } | null;
    onDismiss: () => void;
  }) => {
    if (!error) return null;

    // Auto-scroll to error when it appears
    useEffect(() => {
      if (error) {
        const errorElement = document.getElementById('error-display');
        if (errorElement) {
          errorElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          // Add attention-grabbing animation
          errorElement.classList.add('animate-bounce');
          setTimeout(() => {
            errorElement.classList.remove('animate-bounce');
          }, 2000);
        }
      }
    }, [error]);

    const getErrorStyles = () => {
      switch (error.type) {
        case 'error':
          return {
            bg: 'bg-gradient-to-r from-red-600/20 to-red-500/20',
            border: 'border-red-500/50',
            icon: '❌',
            iconBg: 'bg-red-500',
            textTitle: 'text-red-300',
            textMessage: 'text-red-200'
          };
        case 'warning':
          return {
            bg: 'bg-gradient-to-r from-yellow-600/20 to-yellow-500/20',
            border: 'border-yellow-500/50',
            icon: '⚠️',
            iconBg: 'bg-yellow-500',
            textTitle: 'text-yellow-300',
            textMessage: 'text-yellow-200'
          };
        case 'info':
          return {
            bg: 'bg-gradient-to-r from-blue-600/20 to-blue-500/20',
            border: 'border-blue-500/50',
            icon: 'ℹ️',
            iconBg: 'bg-blue-500',
            textTitle: 'text-blue-300',
            textMessage: 'text-blue-200'
          };
        default:
          return {
            bg: 'bg-gradient-to-r from-red-600/20 to-red-500/20',
            border: 'border-red-500/50',
            icon: '❌',
            iconBg: 'bg-red-500',
            textTitle: 'text-red-300',
            textMessage: 'text-red-200'
          };
      }
    };

    const styles = getErrorStyles();

    return (
      <div 
        id="error-display" 
        className={`${styles.bg} ${styles.border} border-2 rounded-xl p-6 mb-6 shadow-2xl animate-pulse transition-all duration-300 hover:scale-[1.02] max-w-full break-words`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-start">
          <div className={`${styles.iconBg} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-4 animate-bounce shadow-lg`}>
            <span className="text-white text-lg font-bold">{styles.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-black text-xl ${styles.textTitle} mb-3 tracking-wide uppercase`}>
              {error.title}
            </h4>
            <div className={`${styles.textMessage} mb-4 text-base leading-relaxed whitespace-pre-wrap font-medium`}>
              {error.message}
            </div>
            {error.suggestion && (
              <div className="bg-black/30 rounded-lg p-4 mt-4 border border-white/10">
                <p className="text-gray-200 text-sm font-medium">
                  <span className="font-bold text-yellow-300">💡 Suggestion:</span> {error.suggestion}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-white transition-colors ml-2 p-1 hover:bg-white/10 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Question form handling
  const handleQuestionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setQuestionForm(prev => {
      const newForm = {
        ...prev,
        [name]: name === 'questionType' || name === 'points' || name === 'timeInMinutes'
          ? parseInt(value) || 0 
          : value
      };
      
      // Clear fields when switching question types
      if (name === 'questionType') {
        const questionType = parseInt(value);
        
        // Clear all options first
        newForm.optionA = '';
        newForm.optionB = '';
        newForm.optionC = '';
        newForm.optionD = '';
        newForm.correctAnswer = '';
        
        // Set default timeInMinutes for QuestionPreview papers
        if (selectedPaper?.presentationType === 1) {
          newForm.timeInMinutes = 2;
        }
      }
      
      return newForm;
    });
  };

  // Open question modal for specific paper
  const openQuestionModal = (paper: ExamPaperFormData, paperId: string) => {
    console.log('🔍 Opening question modal');
    console.log('📄 Paper data:', paper);
    console.log('🆔 Paper ID received:', paperId);
    console.log('🆔 Paper ID from paper.id:', paper.id);
    
    setSelectedPaper(paper);
    setQuestionForm({
      examPaperId: paperId,
      questionText: '',
      questionType: 1,
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: '',
      points: 5,
      timeInMinutes: paper.presentationType === 1 ? 2 : undefined
    });
    
    console.log('✅ Question form initialized with examPaperId:', paperId);
    setShowQuestionModal(true);
  };

  // Add question to paper
  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuestionLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      // Validate required fields based on question type
      if (!questionForm.questionText || !questionForm.correctAnswer) {
        toast.error('Please fill in all required fields');
        setQuestionLoading(false);
        return;
      }

      // Question type specific validation
      if (questionForm.questionType === 1) {
        // Multiple Choice validation
        if (!questionForm.optionA || !questionForm.optionB || !questionForm.optionC || !questionForm.optionD) {
          toast.error('All options (A, B, C, D) are required for Multiple Choice questions');
          setQuestionLoading(false);
          return;
        }
        // Validate correct answer format for Multiple Choice
        if (!['A', 'B', 'C', 'D'].includes(questionForm.correctAnswer)) {
          toast.error('Correct answer must be A, B, C, or D for Multiple Choice questions');
          setQuestionLoading(false);
          return;
        }
      } else if (questionForm.questionType === 2) {
        // True/False validation
        if (!['TRUE', 'FALSE'].includes(questionForm.correctAnswer)) {
          toast.error('Correct answer must be TRUE or FALSE for True/False questions');
          setQuestionLoading(false);
          return;
        }
      }

      // Validate timeInMinutes for QuestionPreview papers
      if (selectedPaper?.presentationType === 1 && (!questionForm.timeInMinutes || questionForm.timeInMinutes < 1 || questionForm.timeInMinutes > 60)) {
        toast.error('Time per question is required for QuestionPreview mode (1-60 minutes)');
        setQuestionLoading(false);
        return;
      }

      // Build request data based on question type
      const requestData: any = {
        examPaperId: questionForm.examPaperId,
        questionText: questionForm.questionText,
        questionType: questionForm.questionType,
        correctAnswer: questionForm.correctAnswer,
        points: questionForm.points,
        // 🎯 ALWAYS include options - real for Multiple Choice, empty for others
        optionA: questionForm.questionType === 1 ? questionForm.optionA : "",
        optionB: questionForm.questionType === 1 ? questionForm.optionB : "",
        optionC: questionForm.questionType === 1 ? questionForm.optionC : "",
        optionD: questionForm.questionType === 1 ? questionForm.optionD : ""
      };

      // Add timeInMinutes ONLY for QuestionPreview papers (presentationType: 1)
      if (selectedPaper?.presentationType === 1) {
        requestData.timeInMinutes = questionForm.timeInMinutes;
      }

      // Enhanced beautiful console logging
      console.log('🚀 CREATING QUESTION');
      console.log('📤 Request URL:', 'http://159.65.31.191/api/ExamPaper/questions');
      console.log('🔑 Token Info:');
      console.log('   - Token exists:', !!token);
      console.log('   - Token length:', token.length);
      console.log('   - Token start:', token.substring(0, 30));
      console.log('   - Token end:', '...' + token.substring(token.length - 20));
      console.log('📝 Question Details:');
      console.log('   - Question Type:', questionForm.questionType, '(', questionForm.questionType === 1 ? 'Multiple Choice' : questionForm.questionType === 2 ? 'True/False' : questionForm.questionType === 3 ? 'Short Answer' : 'Essay', ')');
      console.log('   - Paper ID:', questionForm.examPaperId);
      console.log('   - Paper Presentation Type:', selectedPaper?.presentationType, '(', selectedPaper?.presentationType === 1 ? 'QuestionPreview' : 'SubjectPreview', ')');
      console.log('   - Points:', questionForm.points);
      console.log('   - Time per Question:', questionForm.timeInMinutes || 'Not applicable');
      console.log('📤 Request Headers:', {
        'Authorization': `Bearer ${token.substring(0, 20)}...`, // Only show first 20 chars for security
        'Content-Type': 'application/json'
      });
      console.log('📤 Question Request Data:', JSON.stringify(requestData, null, 2));

      const response = await axios.post(
        'http://159.65.31.191/api/ExamPaper/questions',
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Enhanced beautiful response logging
      console.log('📥 QUESTION RESPONSE RECEIVED');
      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Headers:', response.headers);
      console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));
      console.log('✅ SUCCESS: Question request completed successfully!');

      if (response.status === 200 || response.status === 201) {
        // Add to questions list
        const newQuestion: AddedQuestion = {
          id: response.data.data,
          questionText: questionForm.questionText,
          questionType: questionForm.questionType,
          points: questionForm.points,
          examPaperId: questionForm.examPaperId
        };
        
        setAddedQuestions(prev => [...prev, newQuestion]);
        
        const questionTypeNames = {
          1: 'Multiple Choice',
          2: 'True/False',
          3: 'Short Answer',
          4: 'Essay'
        };

        toast.success(
          `✅ Question added successfully!\n` +
          `📝 Type: ${questionTypeNames[questionForm.questionType as keyof typeof questionTypeNames]}\n` +
          `🎯 Points: ${questionForm.points}`,
          {
            duration: 4000,
            style: {
              background: '#10B981',
              color: 'white',
              fontWeight: 'bold',
              padding: '16px',
              borderRadius: '8px'
            }
          }
        );

        console.log('✅ SUCCESS: Question added successfully!');
        console.log('❓ Question ID:', response.data.data);

        // Reset form but keep paper ID
        setQuestionForm({
          examPaperId: questionForm.examPaperId,
          questionText: '',
          questionType: 1,
          optionA: '',
          optionB: '',
          optionC: '',
          optionD: '',
          correctAnswer: '',
          points: 5,
          timeInMinutes: selectedPaper?.presentationType === 1 ? 2 : undefined
        });
      }
    } catch (error: any) {
      // Enhanced error logging
      console.error('❌ ERROR CREATING QUESTION');
      console.error('❌ Error Details:', error);
      
      if (error.response) {
        console.error('📥 Error Response Status:', error.response.status);
        console.error('📥 Error Response Headers:', error.response.headers);
        console.error('📥 Error Response Data:', JSON.stringify(error.response.data, null, 2));
        
        // Extract comprehensive error information
        const errorData = error.response.data;
        const statusCode = error.response.status;
        const statusText = error.response.statusText;
        
        let errorMessage = '';
        let errorTitle = '';
        
        // Determine error title based on status code
        switch (statusCode) {
          case 400:
            errorTitle = '❌ Invalid Question Data';
            break;
          case 401:
            errorTitle = '🔒 Authentication Failed';
            break;
          case 403:
            errorTitle = '🚫 Permission Denied';
            break;
          case 404:
            errorTitle = '🔍 Paper Not Found';
            break;
          case 409:
            errorTitle = '⚠️ Question Conflict';
            break;
          case 422:
            errorTitle = '📝 Question Validation Failed';
            break;
          case 500:
            errorTitle = '💥 Server Error';
            break;
          default:
            errorTitle = `❌ Question Error ${statusCode}`;
        }
        
        // Extract error messages
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
        
        // Handle validation errors array
        if (errorData?.errors) {
          if (Array.isArray(errorData.errors)) {
            errorMessage += '\n\nValidation Errors:\n• ' + errorData.errors.join('\n• ');
          } else if (typeof errorData.errors === 'object') {
            // Handle field-specific errors
            const fieldErrors = Object.entries(errorData.errors)
              .map(([field, messages]) => {
                if (Array.isArray(messages)) {
                  return `${field}: ${messages.join(', ')}`;
                }
                return `${field}: ${messages}`;
              });
            errorMessage += '\n\nField Errors:\n• ' + fieldErrors.join('\n• ');
          }
        }
        
        // Handle additional error details
        if (errorData?.details) {
          errorMessage += '\n\nDetails: ' + errorData.details;
        }
        
        // Handle title/type from some API responses
        if (errorData?.title && errorData.title !== errorData.message) {
          errorMessage += '\n\nType: ' + errorData.title;
        }
        
        // Add helpful suggestions based on common errors
        let suggestion = '';
        if (errorMessage.toLowerCase().includes('total points') || errorMessage.toLowerCase().includes('points')) {
          suggestion = '\n\n💡 Tip: Check if you have enough remaining points in your exam session. Reduce question points or increase exam total points.';
        } else if (errorMessage.toLowerCase().includes('correct answer')) {
          suggestion = '\n\n💡 Tip: Ensure correct answer format - use A,B,C,D for Multiple Choice or TRUE/FALSE for True/False questions.';
        } else if (errorMessage.toLowerCase().includes('options') || errorMessage.toLowerCase().includes('option')) {
          suggestion = '\n\n💡 Tip: All options (A, B, C, D) are required for Multiple Choice questions.';
        } else if (errorMessage.toLowerCase().includes('time') || errorMessage.toLowerCase().includes('minutes')) {
          suggestion = '\n\n💡 Tip: Time per question is required for QuestionPreview papers (1-60 minutes).';
        } else if (errorMessage.toLowerCase().includes('paper') || errorMessage.toLowerCase().includes('not found')) {
          suggestion = '\n\n💡 Tip: The exam paper may have been deleted. Please refresh and try again.';
        } else if (errorMessage.toLowerCase().includes('duplicate') || errorMessage.toLowerCase().includes('already exists')) {
          suggestion = '\n\n💡 Tip: This question may already exist. Try modifying the question text.';
        } else if (errorMessage.toLowerCase().includes('permission') || errorMessage.toLowerCase().includes('forbidden')) {
          suggestion = '\n\n💡 Tip: Check if you have permission to add questions to this paper.';
        } else if (errorMessage.toLowerCase().includes('token') || errorMessage.toLowerCase().includes('unauthorized')) {
          suggestion = '\n\n💡 Tip: Please try logging in again.';
        }
        
        // Fallback message if no specific message found
        if (!errorMessage.trim()) {
          errorMessage = `HTTP ${statusCode}: ${statusText}`;
        }
        
        // Display beautiful error toast
        toast.error(
          `${errorTitle}\n\n${errorMessage}${suggestion}`,
          {
            duration: 10000, // Show longer for errors
            style: {
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: 'white',
              fontWeight: 'bold',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #FCA5A5',
              maxWidth: '500px',
              fontSize: '14px',
              lineHeight: '1.5',
              boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.3), 0 10px 10px -5px rgba(239, 68, 68, 0.2)'
            }
          }
        );
        
        // Log formatted error for debugging
        console.error(`${errorTitle}: ${errorMessage}`);
        
      } else if (error.request) {
        console.error('📡 Network Error - No response received:', error.request);
        toast.error(
          '📡 Network Connection Error\n\nUnable to reach the server while adding question. Please check your internet connection and try again.',
          {
            duration: 8000,
            style: {
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: 'white',
              fontWeight: 'bold',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #FCD34D'
            }
          }
        );
        
      } else {
        console.error('⚠️ Request Setup Error:', error.message);
        toast.error(
          `⚠️ Question Request Error\n\n${error.message}\n\n💡 Tip: Please try refreshing the page and adding the question again.`,
          {
            duration: 8000,
            style: {
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              color: 'white',
              fontWeight: 'bold',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #C4B5FD'
            }
          }
        );
      }
    } finally {
      setQuestionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-lg text-black">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{questionStats.total}</h3>
              <p className="text-sm font-medium opacity-80">My Questions</p>
            </div>
            <div className="bg-yellow-400/30 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">5</h3>
              <p className="text-sm font-medium opacity-80">My Subjects</p>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">4</h3>
              <p className="text-sm font-medium opacity-80">Question Types</p>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">9</h3>
              <p className="text-sm font-medium opacity-80">Active Exams</p>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Questions by Type */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Questions by Type</h3>
          <div className="space-y-4">
            {questionStats.byType.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{item.type}</span>
                  <span className="text-white font-medium">{item.count}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${item.color} h-2 rounded-full`} 
                    style={{ width: `${(item.count / questionStats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Questions by Subject */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Questions by Subject</h3>
          <div className="grid grid-cols-2 gap-4">
            {questionStats.bySubject.map((item, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-3 flex items-center">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color} mr-2`}></div>
                <div className="flex-1">
                  <h4 className="text-sm text-white">{item.subject}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{item.count} questions</span>
                    <span className="text-xs text-gray-400">{Math.round((item.count / questionStats.total) * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="px-4 py-2 text-xs font-medium text-gray-400 uppercase">Action</th>
                <th className="px-4 py-2 text-xs font-medium text-gray-400 uppercase">Type</th>
                <th className="px-4 py-2 text-xs font-medium text-gray-400 uppercase">Subject</th>
                <th className="px-4 py-2 text-xs font-medium text-gray-400 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {questionStats.recentActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-white">{activity.action}</td>
                  <td className="px-4 py-3 text-gray-300">{activity.questionType}</td>
                  <td className="px-4 py-3 text-gray-300">{activity.subject}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{activity.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <button 
          onClick={() => setShowExamModal(true)}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-medium py-2 px-4 rounded-lg flex items-center transition-all duration-200"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Create Exam
        </button>
        <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-medium py-2 px-4 rounded-lg flex items-center transition-all duration-200">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Question
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-all duration-200">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Create Question Pool
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-all duration-200">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Questions
        </button>
      </div>
      
      {/* Create Exam Modal */}
      {showExamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header with Steps */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  Exam Setup Wizard
                </h2>
                <button 
                  onClick={resetWorkflow}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Step Indicator */}
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                        step.completed 
                          ? 'bg-green-500 text-white'
                          : currentStep === step.step
                          ? 'bg-yellow-500 text-black'
                          : 'bg-gray-600 text-gray-400'
                      }`}>
                        {step.completed ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          step.step
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <div className={`text-sm font-medium ${
                          currentStep === step.step ? 'text-yellow-500' : step.completed ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-500">{step.description}</div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-1 mx-4 transition-all duration-300 ${
                        step.completed ? 'bg-green-500' : 'bg-gray-600'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Step Content */}
            <div className="p-6">
              {currentStep === 1 && (
                <form onSubmit={handleCreateExam} className="space-y-6">
                  {/* Error Display for Step 1 */}
                  <ErrorDisplay error={formError} onDismiss={() => setFormError(null)} />
                  
                  {/* Basic Information Section */}
                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <h3 className="text-gray-300 text-sm font-semibold mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Exam Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={examForm.title}
                          onChange={handleExamFormChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g., Mathematics Mid-Term Exam"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={examForm.description}
                          onChange={handleExamFormChange}
                          rows={3}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                          placeholder="Brief description of the exam..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Class Assignment Section */}
                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <h3 className="text-gray-300 text-sm font-semibold mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Class Assignment
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Class <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="classId"
                          value={examForm.classId}
                          onChange={handleExamFormChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                          required
                        >
                          <option value="">Select Class</option>
                          {classes.map(cls => (
                            <option key={cls.classId} value={cls.classId}>
                              {cls.className}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Arm <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="armId"
                          value={examForm.armId}
                          onChange={handleExamFormChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                          required
                          disabled={!examForm.classId}
                        >
                          <option value="">Select Arm</option>
                          {getArmsForClass().map(arm => (
                            <option key={arm.armId} value={arm.armId}>
                              {arm.armName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Exam Configuration Section */}
                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <h3 className="text-gray-300 text-sm font-semibold mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Exam Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Number of Papers
                        </label>
                        <input
                          type="number"
                          name="numberOfPapers"
                          value={examForm.numberOfPapers}
                          onChange={handleExamFormChange}
                          min="1"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Duration (Minutes)
                        </label>
                        <input
                          type="number"
                          name="totalDurationInMinutes"
                          value={examForm.totalDurationInMinutes}
                          onChange={handleExamFormChange}
                          min="1"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Pass Mark (%)
                        </label>
                        <input
                          type="number"
                          name="passMark"
                          value={examForm.passMark}
                          onChange={handleExamFormChange}
                          min="0"
                          max="100"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                                            <div>                        <label className="block text-sm font-medium text-gray-300 mb-2">                          Question Type                        </label>                        <select                          name="questionType"                          value={examForm.questionType}                          onChange={handleExamFormChange}                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"                        >                          <option value={1}>Multiple Choice</option>                          <option value={2}>True/False</option>                          <option value={3}>Short Answer</option>                          <option value={4}>Essay</option>                        </select>                      </div>                                            <div>                        <label className="block text-sm font-medium text-gray-300 mb-2">                          Total Points <span className="text-red-500">*</span>                        </label>                        <input                          type="number"                          name="totalPoints"                          value={examForm.totalPoints}                          onChange={handleExamFormChange}                          min="1"                          max="1000"                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"                          placeholder="e.g., 100"                          required                        />                        <p className="text-xs text-gray-400 mt-1">                          Maximum total points for all questions in this exam (1-1000)                        </p>                      </div>                    </div>
                  </div>

                  {/* Schedule Section */}
                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <h3 className="text-gray-300 text-sm font-semibold mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Schedule
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Start Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          name="startTime"
                          value={examForm.startTime}
                          onChange={handleExamFormChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          End Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          name="endTime"
                          value={examForm.endTime}
                          onChange={handleExamFormChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={() => setShowExamModal(false)}
                      className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={examLoading}
                      className={`px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 font-bold flex items-center ${
                        examLoading ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'
                      }`}
                    >
                      {examLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Creating...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Create Exam Session
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
              
              {currentStep === 2 && createdExamSession && (
                <div className="space-y-6">
                  {/* Exam Session Info */}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <h3 className="text-green-400 font-semibold">Exam Session Created Successfully!</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                      <div><strong>Title:</strong> {createdExamSession.title}</div>
                      <div><strong>Class:</strong> {createdExamSession.className} - {createdExamSession.armName}</div>
                      <div><strong>Papers Required:</strong> {createdExamSession.numberOfPapers}</div>
                      <div><strong>Papers Added:</strong> {addedPapers.length}</div>
                    </div>
                  </div>
                  
                  {/* Paper Creation Form */}
                  <form onSubmit={handleAddPaper} className="space-y-6">
                    {/* Error Display for Step 2 */}
                    <ErrorDisplay error={paperError} onDismiss={() => setPaperError(null)} />
                    
                    <div className="bg-gray-700/30 rounded-xl p-4">
                      <h3 className="text-gray-300 text-lg font-semibold mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Add Paper {currentPaperIndex + 1} of {createdExamSession.numberOfPapers}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Subject Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="subjectName"
                            value={paperForm.subjectName}
                            onChange={handlePaperFormChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                            placeholder="e.g., Mathematics, English, Science"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Pass Mark for This Paper (%)
                          </label>
                          <input
                            type="number"
                            name="passMarkForThisPaper"
                            value={paperForm.passMarkForThisPaper}
                            onChange={handlePaperFormChange}
                            min="0"
                            max="100"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Time for This Paper (Minutes)
                          </label>
                          <input
                            type="number"
                            name="totalTimeForThisPaperInMinutes"
                            value={paperForm.totalTimeForThisPaperInMinutes}
                            onChange={handlePaperFormChange}
                            min="1"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Presentation Type
                          </label>
                          <select
                            name="presentationType"
                            value={paperForm.presentationType}
                            onChange={handlePaperFormChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value={1}>QuestionPreview - Individual question timers</option>
                            <option value={2}>SubjectPreview - Paper-wide timer</option>
                            <option value={3}>MultipleSubjects - Sequential paper completion</option>
                            <option value={4}>RandomizedQuestions - Anti-cheating randomization</option>
                          </select>
                          <p className="text-xs text-gray-400 mt-1">
                            {paperForm.presentationType === 1 && "⏱️ Each question has its own time limit"}
                            {paperForm.presentationType === 2 && "📄 Students can navigate freely within paper time"}
                            {paperForm.presentationType === 3 && "🔒 Must complete entire paper before accessing next"}
                            {paperForm.presentationType === 4 && "🔀 Questions randomized for each student"}
                          </p>
                        </div>
                        
                        {/* Conditional Time Per Question Field - Only for QuestionPreview */}
                        {paperForm.presentationType === 1 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Time per Question (Minutes) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="defaultTimePerQuestionInMinutes"
                              value={paperForm.defaultTimePerQuestionInMinutes}
                              onChange={handlePaperFormChange}
                              min="1"
                              max="60"
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                              required
                              placeholder="1-60 minutes"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                              ⚡ Required for QuestionPreview mode (1-60 minutes)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Added Papers List */}
                    {addedPapers.length > 0 && (
                      <div className="bg-gray-700/30 rounded-xl p-4">
                        <h4 className="text-gray-300 font-medium mb-3">Added Papers ({addedPapers.length})</h4>
                        <div className="space-y-2">
                          {addedPapers.map((paper, index) => (
                            <div key={index} className="bg-gray-600/50 rounded-lg p-3 flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <div>
                                  <div className="text-white font-medium">{paper.subjectName}</div>
                                  <div className="text-gray-400 text-sm">
                                    {paper.totalTimeForThisPaperInMinutes} min • {paper.passMarkForThisPaper}% pass mark
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                      <button
                        type="button"
                        onClick={resetWorkflow}
                        className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={paperLoading}
                        className={`px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 font-bold flex items-center ${
                          paperLoading ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'
                        }`}
                      >
                        {paperLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Adding Paper...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Paper {currentPaperIndex + 1}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {currentStep === 3 && createdExamSession && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-blue-400 mb-2">Add Questions to Papers</h3>
                    <p className="text-gray-400 mb-6">Create questions for each paper in your exam session.</p>
                  </div>
                  
                  {/* Papers List for Question Addition */}
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold text-lg">Papers in this Exam:</h4>
                    {addedPapers.map((paper, index) => (
                      <div key={index} className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white font-bold">{index + 1}</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium">{paper.subjectName}</h5>
                              <p className="text-gray-400 text-sm">
                                {paper.totalTimeForThisPaperInMinutes} min • {paper.passMarkForThisPaper}% pass mark
                                {paper.presentationType === 1 && ` • ${paper.defaultTimePerQuestionInMinutes} min per question`}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={() => openQuestionModal(paper, paper.id!)}
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium py-2 px-4 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200"
                          >
                            Add Questions
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Question Addition Status */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h4 className="text-yellow-400 font-semibold">Next Phase: Question Management</h4>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Question addition functionality will be integrated next. For now, you can proceed to finalize your exam session.
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-between space-x-4">
                    <button
                      onClick={resetWorkflow}
                      className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                      Add Another Paper
                    </button>
                    <button
                      onClick={() => {
                        setSteps(prev => prev.map(step => 
                          step.step === 3 ? { ...step, completed: true } : step
                        ));
                        setCurrentStep(4);
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 font-bold flex items-center transform hover:scale-105"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Proceed to Review
                    </button>
                  </div>
                </div>
              )}
              
              {currentStep === 4 && createdExamSession && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-green-400 mb-2">Exam Setup Complete!</h3>
                    <p className="text-gray-400 mb-6">Your exam session has been created with all required papers.</p>
                  </div>
                  
                  {/* Final Summary */}
                  <div className="bg-gray-700/30 rounded-xl p-6">
                    <h4 className="text-white font-semibold mb-4">Exam Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <strong className="text-gray-300">Exam Title:</strong>
                        <p className="text-white">{createdExamSession.title}</p>
                      </div>
                      <div>
                        <strong className="text-gray-300">Class & Arm:</strong>
                        <p className="text-white">{createdExamSession.className} - {createdExamSession.armName}</p>
                      </div>
                      <div>
                        <strong className="text-gray-300">Total Papers:</strong>
                        <p className="text-white">{addedPapers.length}</p>
                      </div>
                      <div>
                        <strong className="text-gray-300">Exam ID:</strong>
                        <p className="text-white font-mono text-sm">{createdExamSession.id}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <strong className="text-gray-300">Papers Added:</strong>
                      <div className="mt-2 space-y-2">
                        {addedPapers.map((paper, index) => (
                          <div key={index} className="bg-gray-600/50 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <span className="text-white font-medium">{paper.subjectName}</span>
                              <span className="text-gray-400 text-sm">
                                {paper.totalTimeForThisPaperInMinutes} min • {paper.passMarkForThisPaper}% pass
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetWorkflow}
                      className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 font-bold flex items-center transform hover:scale-105"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Another Paper
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {formError && <ErrorDisplay error={formError} onDismiss={() => setFormError(null)} />}
      {paperError && <ErrorDisplay error={paperError} onDismiss={() => setPaperError(null)} />}
      
      {/* Add Question Modal */}
      {showQuestionModal && selectedPaper && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Add Question - {selectedPaper.subjectName}
                </h2>
                <button 
                  onClick={() => setShowQuestionModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Paper Info */}
              <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-400 text-sm">
                  <strong>Paper:</strong> {selectedPaper.subjectName} • 
                  <strong> Duration:</strong> {selectedPaper.totalTimeForThisPaperInMinutes} min • 
                  <strong> Pass Mark:</strong> {selectedPaper.passMarkForThisPaper}%
                  {selectedPaper.presentationType === 1 && ` • Time per Question: ${selectedPaper.defaultTimePerQuestionInMinutes} min`}
                </p>
              </div>
            </div>
            
            {/* Question Form */}
            <div className="p-6">
              <form onSubmit={handleAddQuestion} className="space-y-6">
                {/* Question Type */}
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <h3 className="text-gray-300 text-sm font-semibold mb-4">Question Type</h3>
                  <select
                    name="questionType"
                    value={questionForm.questionType}
                    onChange={handleQuestionFormChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value={1}>Multiple Choice</option>
                    <option value={2}>True/False</option>
                    <option value={3}>Short Answer</option>
                    <option value={4}>Essay</option>
                  </select>
                </div>

                {/* Question Text */}
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <h3 className="text-gray-300 text-sm font-semibold mb-4">Question</h3>
                  <textarea
                    name="questionText"
                    value={questionForm.questionText}
                    onChange={handleQuestionFormChange}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your question here..."
                    required
                  />
                </div>

                {/* Multiple Choice Options */}
                {questionForm.questionType === 1 && (
                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <h3 className="text-gray-300 text-sm font-semibold mb-4">Answer Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Option A</label>
                        <input
                          type="text"
                          name="optionA"
                          value={questionForm.optionA}
                          onChange={handleQuestionFormChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Option A"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Option B</label>
                        <input
                          type="text"
                          name="optionB"
                          value={questionForm.optionB}
                          onChange={handleQuestionFormChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Option B"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Option C</label>
                        <input
                          type="text"
                          name="optionC"
                          value={questionForm.optionC}
                          onChange={handleQuestionFormChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Option C"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Option D</label>
                        <input
                          type="text"
                          name="optionD"
                          value={questionForm.optionD}
                          onChange={handleQuestionFormChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Option D"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Correct Answer and Points */}
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <h3 className="text-gray-300 text-sm font-semibold mb-4">Answer & Scoring</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Correct Answer <span className="text-red-500">*</span>
                      </label>
                      {questionForm.questionType === 1 ? (
                        <select
                          name="correctAnswer"
                          value={questionForm.correctAnswer}
                          onChange={handleQuestionFormChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                        >
                          <option value="">Select correct option</option>
                          <option value="A">A: {questionForm.optionA}</option>
                          <option value="B">B: {questionForm.optionB}</option>
                          <option value="C">C: {questionForm.optionC}</option>
                          <option value="D">D: {questionForm.optionD}</option>
                        </select>
                                            ) : questionForm.questionType === 2 ? (
                          <select
                            name="correctAnswer"
                            value={questionForm.correctAnswer}
                            onChange={handleQuestionFormChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            required
                          >
                            <option value="">Select answer</option>
                            <option value="TRUE">True</option>
                            <option value="FALSE">False</option>
                          </select>
                      ) : (
                        <textarea
                          name="correctAnswer"
                          value={questionForm.correctAnswer}
                          onChange={handleQuestionFormChange}
                          rows={3}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter the correct answer or marking guide..."
                          required
                        />
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Points</label>
                      <input
                        type="number"
                        name="points"
                        value={questionForm.points}
                        onChange={handleQuestionFormChange}
                        min="1"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Time per Question (only for QuestionPreview papers) */}
                {selectedPaper.presentationType === 1 && (
                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <h3 className="text-gray-300 text-sm font-semibold mb-4">Timing</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Time for this Question (Minutes) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="timeInMinutes"
                        value={questionForm.timeInMinutes || ''}
                        onChange={handleQuestionFormChange}
                        min="1"
                        max="60"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="1-60 minutes"
                        required
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Required for QuestionPreview mode
                      </p>
                    </div>
                  </div>
                )}

                {/* Added Questions List */}
                {addedQuestions.filter(q => q.examPaperId === questionForm.examPaperId).length > 0 && (
                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <h4 className="text-gray-300 font-medium mb-3">
                      Added Questions ({addedQuestions.filter(q => q.examPaperId === questionForm.examPaperId).length})
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {addedQuestions
                        .filter(q => q.examPaperId === questionForm.examPaperId)
                        .map((question, index) => (
                          <div key={question.id} className="bg-gray-600/50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white text-sm font-medium">
                                  Q{index + 1}: {question.questionText.substring(0, 50)}...
                                </p>
                                <p className="text-gray-400 text-xs">
                                  {question.questionType === 1 ? 'Multiple Choice' :
                                   question.questionType === 2 ? 'True/False' :
                                   question.questionType === 3 ? 'Short Answer' : 'Essay'} • {question.points} points
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowQuestionModal(false)}
                    className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={questionLoading}
                    className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-400 hover:to-blue-500 transition-all duration-200 font-bold flex items-center ${
                      questionLoading ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'
                    }`}
                  >
                    {questionLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Adding Question...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Question
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDashboard; 