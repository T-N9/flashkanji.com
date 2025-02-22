


const LoadingJukugoCard: React.FC = () => {


    return (
        <div className="bg-gradient-to-br from-orange-400  to-orange-700 relative font-writing-1 text-white p-5 rounded-md card min-w-[150px] border-4 lg:min-w-[200px] shadow-md !cursor-progress">
            <p
                className={` text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl animate-pulse`}
            >
                ?
            </p>
        </div>
    );
};

export default LoadingJukugoCard;
