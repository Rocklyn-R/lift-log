import { Header } from "../../components/Header";
import { ExerciseCategories } from "./ExerciseCategories/ExerciseCategories"
import { useNavigate, useParams } from "react-router-dom";
import { Exercises } from "./Exercises/Exercises";
import { MdArrowBackIos } from "react-icons/md";


export const ExerciseLibrary = () => {
    const { categoryId } = useParams<{ categoryId?: string }>();
    const navigate = useNavigate();
    const handleNavigateBack = () => {
        if (categoryId) {
            navigate('/exercise-library')
        }
    }


    return (
        <div className="flex flex-col relative h-screen w-full justify-center">
            {categoryId && (
                <button
                    onClick={() => handleNavigateBack()}
                    style={{ height: '0' }}
                    className="absolute top-6 left-12 z-50"
                ><MdArrowBackIos className="text-2xl text-lightestPurple"/></button>
            )}
            {/* Sticky Header */}
            <Header text="Exercise Library" />
            {/* Scrollable content area */}
            <div className="flex-grow overflow-y-auto p-4">
                {/* Conditionally render ExerciseCategories or Exercises based on categoryId */}
                {categoryId ? (
                    <Exercises
                        source="library"
                    />
                ) : (
                    <ExerciseCategories
                        source="library"
                    />
                )}
            </div>
        </div>
    );
}