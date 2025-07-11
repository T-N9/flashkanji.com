


const LoadingJukugoCard: React.FC = () => {


    return (
        <div className="bg-gradient-to-br from-gray-50 via-gray-200 to-gray-400 relative font-writing-1 text-slate-800 p-5 rounded-md card min-w-[150px] border-4 lg:min-w-[200px] shadow-md !cursor-progress">

            <svg className='absolute h-full w-full opacity-50 top-0 left-0' xmlns="http://www.w3.org/2000/svg">
                <filter id="noise" x="0" y="0">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    <feBlend mode="screen" />
                </filter>
                <rect className='w-full h-full' filter="url(#noise)" opacity="0.5" />
            </svg>
            <p
                className={` text-slate-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl animate-pulse`}
            >
                ?
            </p>
        </div>
    );
};

export default LoadingJukugoCard;
