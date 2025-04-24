import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import { CustomSelect } from "../../components/CustomSelect";
import { useEffect, useState } from "react";
import { FaX, FaCheck } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import { selectBodyCompositionGoal, selectTrainingGoal, selectInjuries, changeTrainingGoal, changeBodyCompositionGoal, changeInjuries, selectTrainingProfileLoading } from "../../redux-store/TrainingProfileSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateBodyCompositionGoal, updateInjuries, updateTrainingGoal } from "../../api/training_profile";


export const TrainingProfile = () => {
    const isLoading = useSelector(selectTrainingProfileLoading);
    const [showTrainingGoal, setShowTrainingGoal] = useState(false);
    const [showBodyCompositionGoal, setShowBodyCompositionGoal] = useState(false);
    const [showInjuries, setShowInjuries] = useState(false);
    const trainingGoal = useSelector(selectTrainingGoal);
    const bodyCompositionGoal = useSelector(selectBodyCompositionGoal);
    const injuries = useSelector(selectInjuries);
    const [trainingGoalValue, setTrainingGoalValue] = useState(trainingGoal);
    const [bodyCompositionValue, setBodyCompositionValue] = useState(bodyCompositionGoal);
    const dispatch = useDispatch();
    const possibleInjuries = [
        "Neck / Upper Back",
        "Shoulder",
        "Elbow",
        "Wrist / Hand",
        "Lower Back",
        "Hip / Groin",
        "Knee",
        "Ankle / Foot"
    ]

    useEffect(() => {
        if (injuries) {
            const injuryArray = injuries.split(',').map(injury => injury.trim());
            setSelectedInjuries(injuryArray);
        }


    }, [injuries])


    const [selectedInjuries, setSelectedInjuries] = useState<string[]>([]);

    const handleChangeTrainingGoal = async () => {
        dispatch(changeTrainingGoal(trainingGoalValue));
        setShowTrainingGoal(false);
        await updateTrainingGoal(trainingGoalValue);
    }

    const handleChangeBodyCompositionGoal = async () => {
        dispatch(changeBodyCompositionGoal(bodyCompositionValue));
        setShowBodyCompositionGoal(false);
        await updateBodyCompositionGoal(bodyCompositionValue);
    }


    const handleCheckboxChange = (injury: string) => {
        setSelectedInjuries(prev => {
            if (prev.includes(injury)) {
                return prev.filter(i => i !== injury); // remove
            } else {
                // add and sort based on original order
                return [...prev, injury].sort(
                    (a, b) => possibleInjuries.indexOf(a) - possibleInjuries.indexOf(b)
                );
            }
        });
    };

    const handleChangeInjuries = async () => {
        const injuryString = selectedInjuries.join(', ');
        console.log(injuryString)
        dispatch(changeInjuries(injuryString));
        setShowInjuries(false);
        if(injuryString) {
           await updateInjuries(injuryString); 
        } else {
            await updateInjuries(null)
        }
        
    }

    const handleCancelInjuriesChange = () => {
        if (injuries) {
            console.log(injuries);
            const injuryArray = injuries.split(',').map(injury => injury.trim());
            setSelectedInjuries(injuryArray);
        } else {
            setSelectedInjuries([])
        }
        setShowInjuries(false);
    }


    return (
        <div className="flex flex-col items-center h-full xl:pl-0 pl-16">
            <Header text="Settings" />
            {isLoading ? (
                <div className="dark:bg-darkestPurple flex flex-col items-center justify-center h-screen bg-lightestPurple">
                    <Loading />
                </div>
            ) : (
                <div className=" md:text-base text-xs w-full flex justify-center h-full">
                    <div className=" dark:bg-darkestPurple rounded-none sm:rounded-md border-mediumPurple bg-lightestPurple lg:w-1/3 md:w-2/3 sm:w-3/4 w-full h-fit py-4 sm:py-4 sm:px-4">
                        {/* Training Goal Settings */}
                        <div className="relative dark:bg-darkestPurple mb-4 flex flex-col items-start w-full rounded-none border-y-2 sm:border-2 border-mediumPurple sm:rounded-md p-2 sm:p-4 bg-lightestPurple">

                            <h2 className="text-lg font-bold dark:text-lightestPurple">Training Goal</h2>

                            <div className="flex items-center justify-between text-darkestPurple w-full space-x-4">
                                {showTrainingGoal ? (
                                    <>
                                        <CustomSelect
                                            options={[{ id: 1, name: "Hypertrophy" }, { id: 2, name: "Strength" }, { id: 3, name: "Hybrid" }]}
                                            onChange={(value) => setTrainingGoalValue(value)}
                                            value={trainingGoalValue}
                                            className="w-[9rem] mt-2"
                                        />
                                        <div className="flex space-x-2 items-center">
                                            <button onClick={() => {
                                                handleChangeTrainingGoal()
                                            }} className="mt-2 flex items-center dark:border-mediumPurple border-darkestPurple bg-darkestPurple hover:bg-darkPurple text-lightestPurple justify-center dark:text-lightestPurple border-2 rounded-full p-1 xs-min:p-3 dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple h-fit hover:border-darkPurple dark:hover:border-mediumPurple"><FaCheck className="text-xl" /></button>
                                            <button onClick={() => {
                                                setTrainingGoalValue(trainingGoal)
                                                setShowTrainingGoal(false)
                                            }} className="mt-2 flex items-center justify-center dark:border-mediumPurple border-darkestPurple bg-darkestPurple hover:bg-darkPurple text-lightestPurple  dark:text-lightestPurple border-2 rounded-full p-[.30rem] xs-min:p-[.80rem] dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple h-fit hover:border-darkPurple dark:hover:border-mediumPurple"><FaX className="text-lg" /></button>
                                        </div>

                                    </>
                                ) : (
                                    <div className="flex w-full justify-between items-center">
                                        <span className={`flex ${!trainingGoal && "text-gray-400"} justify-center items-center w-fit rounded-md border-2 border-mediumPurple dark:bg-darkPurple dark:text-lightestPurple font-semibold mt-2 min-h-12 p-3 bg-white min-w-[5rem]`}>{trainingGoal ? trainingGoal : "Select an option"}</span>
                                        <button onClick={() => setShowTrainingGoal(true)} className="bg-darkestPurple dark:border-mediumPurple border-transparent hover:bg-darkPurple text-lightestPurple mt-2 flex items-center justify-center dark:text-lightestPurple border-2 rounded-full p-1 xs-min:p-[.80rem] dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple hover:border-darkPurple dark:hover:border-mediumPurple"><MdOutlineEdit className="text-xl" /></button>
                                    </div>
                                )}

                            </div>
                        </div>
                        {/* Body Composition Goal */}
                        <div className="mb-4 sm:border-2 border-y-2 border-mediumPurple bg-lightestPurple sm:p-4 p-2 rounded-none sm:rounded-md dark:bg-darkestPurple">
                            <h2 className="text-lg font-bold mb-2 dark:text-lightestPurple">Body Composition Goal</h2>
                            <div className="flex items-center w-full justify-between text-darkestPurple space-x-4">
                                {showBodyCompositionGoal ? (
                                    <>
                                        <CustomSelect
                                            options={[{ id: 1, name: "Lose Fat" }, { id: 2, name: "Build Muscle" }, { id: 3, name: "Maintain / Recomp" }]}
                                            onChange={(value) => setBodyCompositionValue(value)}
                                            value={bodyCompositionValue}
                                            className="w-[12rem] mt-2"
                                        />
                                        <div className="flex space-x-2 items-center">
                                            <button onClick={() => handleChangeBodyCompositionGoal()} className="mt-2  border-transparent bg-darkestPurple hover:bg-darkPurple text-lightestPurple flex items-center justify-center dark:text-lightestPurple border-2 rounded-full p-1 xs-min:p-3 dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple h-fit hover:border-darkPurple dark:hover:border-mediumPurple"><FaCheck className="text-xl" /></button>
                                            <button onClick={() => {
                                                setBodyCompositionValue(bodyCompositionGoal)
                                                setShowBodyCompositionGoal(false)
                                            }} className="mt-2 flex items-center justify-center dark:border-mediumPurple dark:text-lightestPurple border-transparent bg-darkestPurple hover:bg-darkPurple text-lightestPurple border-2 rounded-full p-[.30rem] xs-min:p-[.80rem] dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple h-fit hover:border-darkPurple dark:hover:border-mediumPurple"><FaX className="text-lg" /></button>
                                        </div>

                                    </>
                                ) : (
                                    <div className="flex w-full justify-between items-center">
                                        <span className={`flex ${!bodyCompositionGoal && "text-gray-400"} items-center justify-center rounded-md border-2 border-mediumPurple dark:bg-darkPurple dark:text-lightestPurple font-semibold mt-2 min-h-12 p-3 bg-white`}>{bodyCompositionGoal ? bodyCompositionGoal : "Select an option"}</span>
                                        <button onClick={() => setShowBodyCompositionGoal(true)} className="mt-2 dark:border-mediumPurple flex items-center justify-center text-lightestPurple bg-darkestPurple hover:bg-darkPurple border-transparent dark:text-lightestPurple p-1 xs-min:p-3 border-2 rounded-full dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple hover:border-darkPurple dark:hover:border-mediumPurple"><MdOutlineEdit className="text-xl" /></button>
                                    </div>
                                )}

                            </div>
                        </div>
                        <div className="mb-4 sm:border-2 border-y-2 border-mediumPurple bg-lightestPurple sm:p-4 p-2 rounded-none sm:rounded-md dark:bg-darkestPurple">
                            <h2 className="text-lg font-bold mb-2 dark:text-lightestPurple">Injuries</h2>
                            <div className="relative flex items-center w-full justify-between text-darkestPurple space-x-4">
                                {showInjuries ? (
                                    <>
                                        <div className="flex flex-col w-full space-y-2">
                                            {possibleInjuries.map((injury: string) => (
                                                <div className="w-full flex items-center" key={injury}>

                                                    <input
                                                        type="checkbox"
                                                        id={`injury-${injury}`}
                                                        checked={selectedInjuries.includes(injury)}
                                                        onChange={() => handleCheckboxChange(injury)}
                                                        className="styled-checkbox dark:styled-checkbox-dark mx-3"
                                                    />
                                                    <label htmlFor={`injury-${injury}`}>{injury}</label>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="absolute right-0 items-center flex space-x-2">
                                            <button onClick={() => { handleChangeInjuries() }} className="mt-2  border-transparent bg-darkestPurple hover:bg-darkPurple text-lightestPurple flex items-center justify-center dark:text-lightestPurple border-2 rounded-full p-1 xs-min:p-3 dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple h-fit hover:border-darkPurple dark:hover:border-mediumPurple"><FaCheck className="text-xl" /></button>
                                            <button onClick={() => {
                                                handleCancelInjuriesChange();
                                            }} className="mt-2 flex items-center justify-center dark:border-mediumPurple dark:text-lightestPurple border-transparent bg-darkestPurple hover:bg-darkPurple text-lightestPurple border-2 rounded-full p-[.30rem] xs-min:p-[.80rem] dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple h-fit hover:border-darkPurple dark:hover:border-mediumPurple"><FaX className="text-lg" /></button>
                                        </div>


                                    </>

                                ) : (
                                    <div className="flex w-full justify-between items-center">
                                        <div className="flex flex-col">
                                            {selectedInjuries.length > 0 ? (
                                                selectedInjuries.map((injury: string) => (
                                                    <span key={injury} className="flex items-center justify-center rounded-md border-2 border-mediumPurple dark:bg-darkPurple dark:text-lightestPurple font-semibold mt-2 min-h-12 p-3 bg-white">
                                                        {injury}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="flex items-center justify-center rounded-md border-2 border-mediumPurple dark:bg-darkPurple dark:text-lightestPurple font-semibold mt-2 min-h-12 p-3 bg-white">
                                                    None
                                                </span>
                                            )}
                                        </div>
                                        <button onClick={() => {
                                            setShowInjuries(true)
                                        }} className="mt-2 dark:border-mediumPurple flex items-center justify-center text-lightestPurple bg-darkestPurple hover:bg-darkPurple border-transparent dark:text-lightestPurple p-1 sm:p-3 border-2 rounded-full dark:bg-darkPurple dark:hover:bg-lightestPurple dark:hover:text-darkestPurple hover:border-darkPurple dark:hover:border-mediumPurple"><MdOutlineEdit className="text-xl" /></button>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}