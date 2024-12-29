// Assuming this is in a file named BackButton.js

"use client"; // Make this a client component

import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';
import TooltipWrapper from './TooltipWrapper';

const BackButton = () => {
    const handleClick = () => {
        router.back();
    };
    const router = useRouter();

    return (
        <TooltipWrapper content="Back">
            <Button
                size="icon"
                variant={"secondary"}
                onClick={handleClick}
            >
                <ChevronLeft size={20} />
            </Button>
        </TooltipWrapper>
    );
};

export default BackButton;
