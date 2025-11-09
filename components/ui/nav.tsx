'use client';

import { UserButton } from "@clerk/nextjs";
import * as React from "react";

const NavBar: React.FC = () => {
    return <nav className="p-4 flex justify-between items-center">
        <div>
            <h1 className="font-bold">S3 File Manager UI</h1>
        </div>
        <div className="p-4">
            <UserButton />
        </div>
    </nav>
};

export default NavBar;