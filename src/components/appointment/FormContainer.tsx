
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface FormContainerProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

const FormContainer: React.FC<FormContainerProps> = ({ 
  title, 
  children, 
  footer, 
  onSubmit 
}) => {
  return (
    <Card>
      <form onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {children}
        </CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </form>
    </Card>
  );
};

export default FormContainer;
