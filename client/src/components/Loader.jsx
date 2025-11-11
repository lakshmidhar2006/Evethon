import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = true }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
    </div>
  );
};

export default Loader;
