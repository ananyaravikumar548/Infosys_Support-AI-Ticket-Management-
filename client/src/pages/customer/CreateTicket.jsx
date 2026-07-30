import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FiPaperclip } from 'react-icons/fi';

export default function CreateTicket() {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const [file, setFile] = useState(null);
  const descriptionText = watch('description', '');

  const onSubmit = (data) => {
    toast.success('Ticket submitted successfully! AI analysis in progress...');
    reset();
    setFile(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft max-w-4xl mx-auto">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800">Create New Ticket</h2>
        <p className="text-xs text-slate-500">Describe your issue in detail</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
            <input
              {...register('subject', { required: 'Subject is required' })}
              type="text"
              placeholder="Enter a short subject"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.subject && <p className="text-red-500 text-[10px] mt-1">{errors.subject.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Select category</option>
              <option value="Billing">Billing</option>
              <option value="Technical">Technical</option>
              <option value="Account">Account</option>
              <option value="General">General</option>
            </select>
            {errors.category && <p className="text-red-500 text-[10px] mt-1">{errors.category.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
          <div className="relative">
            <textarea
              {...register('description', { 
                required: 'Description is required',
                maxLength: { value: 1000, message: 'Max 1000 characters allowed' }
              })}
              rows={4}
              placeholder="Describe your issue..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <span className="absolute bottom-2 right-3 text-[10px] text-slate-400">
              {descriptionText.length}/1000
            </span>
          </div>
          {errors.description && <p className="text-red-500 text-[10px] mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Attachment (Optional)</label>
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-2 bg-slate-50/50">
            <label className="cursor-pointer bg-white px-3 py-1 text-xs border border-slate-300 rounded-md font-medium text-slate-700 hover:bg-slate-50 shadow-sm flex items-center gap-1">
              <FiPaperclip className="w-3.5 h-3.5" />
              Choose file
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <span className="text-xs text-slate-500 truncate">
              {file ? file.name : 'No file chosen'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Max size: 10MB (PDF, DOC, DOCX, PNG, JPG)</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium shadow-md shadow-indigo-200 transition-colors"
          >
            Submit Ticket
          </button>
        </div>
      </form>
    </div>
  );
}