
import React from 'react';

const LoadingAppointmentForm: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
    </div>
  );
};

export default LoadingAppointmentForm;
