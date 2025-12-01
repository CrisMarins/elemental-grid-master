import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TutorialIntro from "@/components/tutorial/TutorialIntro";
import TutorialSudokuRule from "@/components/tutorial/TutorialSudokuRule";
import TutorialColumnRule from "@/components/tutorial/TutorialColumnRule";
import TutorialCombinedRule from "@/components/tutorial/TutorialCombinedRule";
import TutorialInteractionGraph from "@/components/tutorial/TutorialInteractionGraph";
import TutorialAttackDynamic from "@/components/tutorial/TutorialAttackDynamic";
import TutorialDefenseDynamic from "@/components/tutorial/TutorialDefenseDynamic";

const Tutorial = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <TutorialIntro onNext={() => setStep(1)} />;
      case 1:
        return <TutorialSudokuRule onNext={() => setStep(2)} />;
      case 2:
        return <TutorialColumnRule onNext={() => setStep(3)} />;
      case 3:
        return <TutorialCombinedRule onNext={() => setStep(4)} />;
      case 4:
        return <TutorialInteractionGraph onNext={() => setStep(5)} />;
      case 5:
        return <TutorialAttackDynamic onNext={() => setStep(6)} />;
      case 6:
        return <TutorialDefenseDynamic onNext={() => setStep(7)} />;
      default:
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Tutorial Complete!</h2>
            <p className="text-lg text-muted-foreground">
              You've mastered the basics. Ready to play?
            </p>
            <Button onClick={() => navigate("/")} size="lg" className="mt-4">
              Back to Menu
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Menu
        </Button>
        
        <div className="space-y-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
