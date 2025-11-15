'use client';

import { UserButton } from "@clerk/nextjs";
import * as React from "react";
import { Database } from "lucide-react";

const NavBar: React.FC = () => {
    return <nav className="pl-8 pr-8 pt-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Database className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">S3-Sync Dashboard</span>
        </div>
        <div className="p-4">
            <UserButton />
        </div>
    </nav>
};

export default NavBar;