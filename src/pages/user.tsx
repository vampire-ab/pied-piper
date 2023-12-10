import Doctor from "@/components/Doctor";
import Patient from "@/components/Patient";
import type { NextPage } from "next";
import Router from "next/router";
import React from "react";

const Tester: NextPage = () => {
    const [isDoctor, setIsDoctor] = React.useState(false);
    const [isSet, setIsSet] = React.useState(false);
    return (<div className="flex gap-10 items-center justify-center text-3xl">
        {!isSet && <button className="border rounded p-4 hover:bg-slate-600" onClick={() => {
            Router.push({ pathname: "/meet/gvb-wigv-wog", query: { doctor: true } });
        }}>Doctor</button>}
        {!isSet &&
            <button
                className="border rounded p-4 hover:bg-slate-600"
                onClick={() => {
                    setIsDoctor(false);
                    setIsSet(true);
                }
                }>Patient</button>}
        {isSet ? isDoctor ? <Doctor isDoctor={isDoctor} /> : <Patient isDoctor={isDoctor} /> : <></>}
    </div >)
};

export default Tester;
