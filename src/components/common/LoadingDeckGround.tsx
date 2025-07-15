import React from "react";
import LoadingJukugoCard from "../cards/LoadingJukugoCard";

export const LoadingDeckGround = () => {

    return (
        <>
            <div className="grid lg:max-w-[1280px] w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }, (_, index) => index + 1).map(
                    (item, index) => {
                        return (
                            <LoadingJukugoCard key={index} />
                        );
                    }
                )}
            </div>

        </>
    );
};
