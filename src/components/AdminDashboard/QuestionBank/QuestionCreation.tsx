import React, { useState } from 'react';

const subjects = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Art',
];

const questionTypes = [
  'Multiple Choice',
  'True/False',
  'Essay',
  'Short Answer',
  'Matching',
  'Numerical',
];

interface ChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

const QuestionCreation: React.FC = () => {
  const [questionType, setQuestionType] = useState('Multiple Choice');
  const [questionText, setQuestionText] = useState('');
  const [subject, setSubject] = useState(subjects[0]);
  const [difficulty, setDifficulty] = useState('Medium');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [options, setOptions] = useState<ChoiceOption[]>([
    { id: '1', text: '', isCorrect: false },
    { id: '2', text: '', isCorrect: false },
    { id: '3', text: '', isCorrect: false },
    { id: '4', text: '', isCorrect: false },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [points, setPoints] = useState(1);
  
  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleOptionChange = (id: string, text: string) => {
    setOptions(
      options.map(option => (option.id === id ? { ...option, text } : option))
    );
  };
  
  const handleCorrectOptionChange = (id: string) => {
    setOptions(
      options.map(option => ({
        ...option,
        isCorrect: option.id === id
      }))
    );
  };
  
  const handleAddOption = () => {
    const newId = (options.length + 1).toString();
    setOptions([...options, { id: newId, text: '', isCorrect: false }]);
  };
  
  const handleRemoveOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(option => option.id !== id));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically submit the question data to your API
    console.log({
      questionType,
      questionText,
      subject,
      difficulty,
      tags,
      options: questionType === 'Multiple Choice' ? options : undefined,
      correctAnswer: questionType !== 'Multiple Choice' ? correctAnswer : undefined,
      explanation,
      points
    });
    alert('Question saved successfully!');
  };
  
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Create New Question</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Type Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Question Type</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {questionTypes.map(type => (
              <button
                key={type}
                type="button"
                className={`p-3 rounded-lg border ${
                  questionType === type
                    ? 'bg-yellow-500 text-black border-yellow-600'
                    : 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'
                } flex flex-col items-center justify-center transition-colors text-sm font-medium`}
                onClick={() => setQuestionType(type)}
              >
                {type === 'Multiple Choice' && (
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {type === 'Essay' && (
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                )}
                {type === 'True/False' && (
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                )}
                {type === 'Short Answer' && (
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                )}
                {type === 'Matching' && (
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                )}
                {type === 'Numerical' && (
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                )}
                {type}
              </button>
            ))}
          </div>
        </div>
        
        {/* Question Text */}
        <div className="space-y-2">
          <label htmlFor="questionText" className="block text-sm font-medium text-gray-300">
            Question Text <span className="text-red-500">*</span>
          </label>
          <textarea
            id="questionText"
            rows={4}
            required
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter your question here..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
        
        {/* Question Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              id="subject"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              {subjects.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300">
              Difficulty
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="points" className="block text-sm font-medium text-gray-300">
              Points
            </label>
            <input
              id="points"
              type="number"
              min={1}
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Tags */}
        <div className="space-y-2">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-300">
            Tags
          </label>
          <div className="flex">
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tags (press Enter or click Add)"
              className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-yellow-500 text-black px-4 py-2 rounded-r-lg font-medium hover:bg-yellow-400 transition-colors"
            >
              Add
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center bg-gray-700 text-white px-2 py-1 rounded text-sm">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-gray-400 hover:text-gray-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Answer Options - Based on Question Type */}
        <div className="space-y-4 border-t border-gray-700 pt-4">
          <h3 className="text-lg font-semibold text-white">Answer Options</h3>
          
          {questionType === 'Multiple Choice' && (
            <div className="space-y-4">
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`option-${option.id}`}
                    name="correctOption"
                    checked={option.isCorrect}
                    onChange={() => handleCorrectOptionChange(option.id)}
                    className="h-4 w-4 text-yellow-500 border-gray-600 focus:ring-offset-gray-800 focus:ring-yellow-500"
                  />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    placeholder={`Option ${option.id}`}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(option.id)}
                    disabled={options.length <= 2}
                    className={`text-gray-400 hover:text-gray-200 ${options.length <= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleAddOption}
                className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Option
              </button>
            </div>
          )}
          
          {questionType === 'True/False' && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="true-option"
                  name="trueFalse"
                  value="true"
                  checked={correctAnswer === 'true'}
                  onChange={() => setCorrectAnswer('true')}
                  className="h-4 w-4 text-yellow-500 border-gray-600 focus:ring-offset-gray-800 focus:ring-yellow-500"
                />
                <label htmlFor="true-option" className="text-white">True</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="false-option"
                  name="trueFalse"
                  value="false"
                  checked={correctAnswer === 'false'}
                  onChange={() => setCorrectAnswer('false')}
                  className="h-4 w-4 text-yellow-500 border-gray-600 focus:ring-offset-gray-800 focus:ring-yellow-500"
                />
                <label htmlFor="false-option" className="text-white">False</label>
              </div>
            </div>
          )}
          
          {(questionType === 'Short Answer' || questionType === 'Numerical') && (
            <div className="space-y-2">
              <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-300">
                Correct Answer
              </label>
              <input
                type="text"
                id="correctAnswer"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Enter the correct answer"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              {questionType === 'Numerical' && (
                <p className="text-sm text-gray-400">For numerical answers, you can specify a range by using the format "10±2" to accept answers between 8 and 12.</p>
              )}
            </div>
          )}
          
          {questionType === 'Essay' && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Essay questions will need to be manually graded after submission.</p>
            </div>
          )}
          
          {questionType === 'Matching' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">Matching questions functionality is not implemented in this demo.</p>
            </div>
          )}
        </div>
        
        {/* Explanation */}
        <div className="space-y-2">
          <label htmlFor="explanation" className="block text-sm font-medium text-gray-300">
            Explanation (Optional)
          </label>
          <textarea
            id="explanation"
            rows={3}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Explain why the correct answer is correct..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-400">This explanation will be shown to students after they answer the question.</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <button
            type="button"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200"
          >
            <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Question
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionCreation; 