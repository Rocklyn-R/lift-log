export const Wrapper = (props: any) => {
    //const [item, setItem] = useSta
    return <div className={`w-full flex justify-center ${props.className}`}>{props.children}</div>;
};