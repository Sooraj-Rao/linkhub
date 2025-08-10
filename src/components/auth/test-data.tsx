import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TestCredentialsProps {
  onUse: (email: string, password: string) => void;
}

const TestCredentials: React.FC<TestCredentialsProps> = ({ onUse }) => {
  const demoEmail = "a@b.com";
  const demoPassword = "a@b.com";

  const handleUseDemo = () => {
    onUse(demoEmail, demoPassword);
  };

  return (
    <Card className="absolute  top-2 z-50 bg-background right-4 w-64 shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">Try it out!</h3>
        </div>
        <p className="text-sm mb-3">
          Experience the app instantly with our demo account.
        </p>
        <Button onClick={handleUseDemo} className="w-full">
          Use Demo Credentials
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestCredentials;
