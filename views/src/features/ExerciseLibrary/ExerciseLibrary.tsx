import { Wrapper } from "../../components/Wrapper"
import { ExerciseCategories } from "./Categories/Categories"

export const ExerciseLibrary = () => {
    

    return (
        <Wrapper className="flex flex-col">
                <h1 className="text-lightestBlue bg-darkestBlue text-xl font-semibold flex-grow text-center p-5">Exercise Library</h1>
                <ExerciseCategories />
        </Wrapper>
    )
}