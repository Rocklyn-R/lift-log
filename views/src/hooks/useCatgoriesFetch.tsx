import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../redux-store/UserSlice";
import { getCategories } from "../api/exercises";
import { setCategories } from "../redux-store/LibrarySlice";


export const useCategoriesFetch = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();

    useEffect(() => {
        const categoriesFetch = async () => {
            const exerciseCategories = await getCategories();
            if (exerciseCategories) {
                dispatch(setCategories(exerciseCategories))
            }
        }
        categoriesFetch();

    }, [isAuthenticated, dispatch]);
}