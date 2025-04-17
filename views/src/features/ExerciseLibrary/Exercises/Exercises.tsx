import { useSelector } from "react-redux"
import { selectCategories, selectExercises, setExercises } from "../../../redux-store/LibrarySlice"
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { OverlayWindow } from "../../../components/OverlayWIndow";
import { Exercise, SelectedExercise } from "../../../types/types";
import { getExercises } from "../../../api/exercises";
import { useDispatch } from "react-redux";
import { selectSelectedCategory, selectSelectedExercise, setSelectedExercise } from "../../../redux-store/LogsSlice";
import { ViewLog } from "../../LogsPage/AddLog/ViewLog/ViewLog";
import { Loading } from "../../../components/Loading";
import { FiMoreVertical } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { EditExercise } from "./EditExercise/EditExercise";
import { DeleteExercise } from "./DeleteExercise/DeleteExercise";


interface ExercisesProps {
    source: "logs" | "library",
    handleShowCategories?: () => void;
    handleSelectExercise?: () => void;
}

export const Exercises: React.FC<ExercisesProps> = ({ source, handleShowCategories, handleSelectExercise }) => {
    const exercises = useSelector(selectExercises);
    const selectedExercise = useSelector(selectSelectedExercise);
    const { categoryId } = useParams<{ categoryId: string }>();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const selectedCategory = useSelector(selectSelectedCategory);
    const categories = useSelector(selectCategories);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showEditExercise, setShowEditExercise] = useState(false);
    const [exerciseToUpdate, setExerciseToUpdate] = useState<SelectedExercise | null>(null);
    const [showDeleteExercise, setShowDeleteExercise] = useState(false);

    const handleOpenExercise = (exercise: Exercise) => {
        if (openDropdown !== null) {
            setOpenDropdown(null);
            return;
        }
        if (source === "library") {
            dispatch(setSelectedExercise(exercise))
        } else if (source === "logs" && handleSelectExercise) {
            handleSelectExercise();
            dispatch(setSelectedExercise(exercise));
        }
    }

    const handleCloseExercise = () => {
        dispatch(setSelectedExercise(null))
    }

    useEffect(() => {
        const fetchExercises = async () => {
            if (categoryId && source === "library") {
                const exerciseResults = await getExercises(parseInt(categoryId));
                dispatch(setExercises(exerciseResults))
                setLoading(false);
            }
        }
        if (source === "library") {
            fetchExercises();
        }
    }, [categoryId, dispatch, source])

    useEffect(() => {
        const fetchExercises = async () => {
            const categoryId = categories.find(category => category.name === selectedCategory)?.id;
            if (categoryId && source === "logs") {
                const exercisesFetch = await getExercises(categoryId);
                dispatch(setExercises(exercisesFetch));
                setLoading(false);
            }
        }
        if (source === "logs") {
            fetchExercises();
        }

    }, [dispatch, setLoading, categories, selectedCategory, source])


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !(event.target as HTMLElement).closest(".exercise-button") // Prevent closing if clicked inside an exercise button
            ) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    return (
        <div className="flex flex-col box-border my-2">
            {/* Main Content with Flex for center alignment */}
            <div className="flex-grow flex justify-center">

                <div className={`${source === "library" ? "md:w-1/2" : "md:w-2/3"} flex flex-col items-center sm:w-2/3 xs:w-3/4 w-full space-y-2`}>
                    {loading ? (
                        <Loading />
                    ) : (
                        exercises.map((exercise, index) => (
                            <div key={index} className="relative w-full flex justify-center dark:text-lightestPurple dark:hover:text-darkestPurple">
                                {/* Main Exercise Button (Lower z-index) */}
                                <button
                                    onClick={() => handleOpenExercise(exercise)}
                                    className={`dark:border-mediumPurple dark:text-lightestPurple font-semibold dark:bg-darkPurple exercise-button relative z-10 bg-gray-100 border-2 border-mediumPurple rounded-md shadow-lg ${openDropdown ? "" : "hover:font-semibold hover:text-xl hover:bg-lightPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple"
                                        } sm:text-base text-sm md:text-lg py-2 ${source === "library" ? "px-8" : "px-2"} w-full flex justify-center`}
                                >
                                    <span>{exercise.exercise_name}</span>
                                </button>
                                {source === "library" ? (
                                    <>
                                        {/* Three-Dot Menu */}
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdown(openDropdown === exercise.exercise_id ? null : exercise.exercise_id);
                                                }}
                                                className={`p-2 rounded-full cursor-pointer box-border border-2  
              dark:hover:bg-lightestPurple dark:hover:text-darkestPurple dark:hover:border-mediumPurple hover:border-mediumPurple hover:bg-lightPurple
              ${openDropdown === exercise.exercise_id ? "border-2 dark:border-mediumPurple dark:text-darkestPurple dark:bg-lightestPurple border-mediumPurple bg-lightPurple" : "border-transparent"}`}
                                            >
                                                <FiMoreVertical className="w-5 h-5" />
                                            </div>
                                        </div>

                                        {/* Dropdown Menu (Highest z-index) */}
                                        {openDropdown === exercise.exercise_id && (
                                            <div
                                                ref={dropdownRef}
                                                className="dark:border-mediumPurple border-mediumPurple border-2 absolute right-2 top-7 mt-2 w-32 dark:bg-darkestPurple bg-white rounded-md shadow-lg z-50"
                                            >
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowEditExercise(true);
                                                        setOpenDropdown(null);
                                                        setExerciseToUpdate(exercise);
                                                    }}
                                                    className="flex justify-between items-center rounded-t-[.25rem] w-full text-left px-4 py-2 text-md dark:text-lightestPurple font-semibold text-darkestPurple dark:hover:bg-darkPurple hover:bg-lightPurple cursor-pointer"
                                                >
                                                    <span> Edit</span>
                                                    <MdOutlineEdit className="text-lg" />

                                                </div>
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowDeleteExercise(true);
                                                        setOpenDropdown(null);
                                                        setExerciseToUpdate(exercise)
                                                    }}
                                                    className="flex justify-between items-center w-full rounded-b-[.25rem] hover:border-mediumPurple text-left px-4 py-2 text-md dark:text-lightestPurple font-semibold text-darkestPurple dark:hover:bg-darkPurple hover:bg-lightPurple cursor-pointer"
                                                >
                                                    <span>Delete</span>
                                                    <MdDeleteOutline className="text-lg" />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : ""}

                            </div>
                        ))
                    )}
                </div>
            </div>
            {showEditExercise && exerciseToUpdate && (source === "library") && (
                <OverlayWindow
                    headerText={`Edit - ${exerciseToUpdate.exercise_name}`}
                    onClose={() => {
                        setShowEditExercise(false);
                        setExerciseToUpdate(null);
                    }}
                    className="phones:w-full xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3"
                    className2="dark:bg-darkestPurple p-4"
                >
                    <EditExercise
                        exercise={exerciseToUpdate}
                        setShowEditExercise={setShowEditExercise}
                        setExerciseToUpdate={setExerciseToUpdate}
                    />
                </OverlayWindow>
            )}
            {selectedExercise && (source === "library") && (
                <OverlayWindow
                    headerText={selectedExercise.exercise_name}
                    onClose={handleCloseExercise}
                    className="phones:w-full xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3"
                    className2="max-h-[75vh] min-h-[65vh]"
                >
                    <ViewLog
                    />
                </OverlayWindow>
            )}
            {showDeleteExercise && exerciseToUpdate && (source === "library") && (
                <OverlayWindow
                    headerText={`Delete - ${exerciseToUpdate.exercise_name}`}
                    onClose={() => {
                        setShowDeleteExercise(false);
                        setExerciseToUpdate(null);
                    }}
                    className="phones:w-full xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3"
                    className2="dark:bg-darkestPurple dark:text-lightestPurple p-4"
                >
                    <DeleteExercise
                        exercise={exerciseToUpdate}
                        setShowDeleteExercise={setShowDeleteExercise}
                        setExerciseToUpdate={setExerciseToUpdate}
                    />
                </OverlayWindow>
            )}
        </div>
    );
};