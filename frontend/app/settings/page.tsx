'use client'

import TopBar from "../ui/top";
// import withAuth from "../withAuth"

const settings = () => {

    return (
        <main className="flex flex-col font-white bg-main overflow-y-hidden xl:h-screen mr-2">
            <TopBar />
            <div className="flex flex-col">
                <div className="flex ">
                    <label >change Nickname</label>
                    <input type="text"></input>
                </div>
                <div className="flex ">
                    <label >change password</label>
                    <input type="password"></input>
                </div>
                <div className="flex ">
                    <label >confirm password</label>
                    <input type="password"></input>
                </div>
            </div>
        </main>
    );
}

export default (settings);