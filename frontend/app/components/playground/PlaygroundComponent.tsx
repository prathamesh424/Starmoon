"use client";

import React, { useEffect, useRef, useState } from "react";
import { useWebSocketHandler } from "@/hooks/useWebSocketHandler";
import { createClient } from "@/utils/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Mic, MicOff, Phone } from "lucide-react";
import { cn, getCreditsRemaining, getMessageRoleName } from "@/lib/utils";
import ControlPanel from "./ControlPanel";
import { Label } from "@radix-ui/react-label";
import { Messages } from "./Messages";
import { getAssistantAvatar, getUserAvatar } from "@/lib/utils";
import { MoonStar, MoonStarIcon } from "lucide-react";
import Image from "next/image";
import PickCharacter from "./PickCharacter";
import PickPersonality from "./PickPersonality";
import PickVoice from "./PickVoice";

interface PlaygroundProps {
    selectedUser: IUser;
    selectedToy: IToy;
    allToys: IToy[];
    allPersonalities: IPersonality[];
    accessToken: string;
}

const Playground: React.FC<PlaygroundProps> = ({
    selectedUser,
    selectedToy,
    allToys,
    accessToken,
    allPersonalities,
}) => {
    const {
        messageHistory,
        emotionDictionary,
        connectionStatus,
        microphoneStream,
        audioBuffer,
        handleClickOpenConnection,
        handleClickInterrupt,
        handleClickCloseConnection,
        muteMicrophone,
        unmuteMicrophone,
        isMuted,
    } = useWebSocketHandler(accessToken, selectedUser);

    const [userState, setUserState] = useState<IUser>(selectedUser);
    const creditsRemaining = getCreditsRemaining(userState);
    // const ref: any = useRef<ComponentRef<typeof Messages> | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

    const user = selectedUser;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const isSelectDisabled = connectionStatus === "Open";

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } =
                scrollContainerRef.current;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
            setIsScrolledToBottom(isAtBottom);
        }
    };

    useEffect(() => {
        if (isScrolledToBottom) {
            scrollToBottom();
        }
    }, [messageHistory, emotionDictionary, isScrolledToBottom]);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
            return () =>
                scrollContainer.removeEventListener("scroll", handleScroll);
        }
    }, []);

    return (
        <div className="flex flex-col">
            <div className="flex-none">
                {messageHistory.length === 0 ? (
                    <div className="flex flex-col w-full justify-center gap-2">
                        <h1 className="text-3xl font-normal">Playground</h1>
                        <p className="text-sm text-gray-600">
                            {creditsRemaining} credits remaining
                        </p>
                        <div className="flex flex-col max-h-[300px] items-start gap-2 my-4 transition-colors duration-200 ease-in-out">
                            <div className="flex flex-row items-start gap-4">
                                <PickPersonality
                                    onPersonalityPicked={() => {}}
                                    allPersonalities={allPersonalities}
                                    selectedPersonalityId={
                                        selectedUser.personality_id
                                    }
                                    isDisabled={isSelectDisabled}
                                />
                                <PickVoice
                                    onVoicePicked={() => {}}
                                    allToys={allToys}
                                    selectedToyId={selectedUser.toy_id}
                                    isDisabled={isSelectDisabled}
                                />
                            </div>
                            <div className="flex flex-row items-center self-center">
                                <div className="max-w-[200px] transition-transform duration-300 ease-in-out scale-90 hover:scale-100">
                                    <Image
                                        src={getAssistantAvatar(
                                            selectedToy.image_src!
                                        )}
                                        width={200}
                                        height={200}
                                        alt={selectedToy.name}
                                        className="w-full h-auto" // Make image responsive within container
                                    />
                                </div>
                                <MoonStar
                                    fill="#4b5563"
                                    className="text-gray-600"
                                />
                                <div className="max-w-[150px]  transition-transform duration-300 ease-in-out scale-90 hover:scale-100">
                                    <Image
                                        src={getUserAvatar(user.email)}
                                        width={200}
                                        height={200}
                                        alt={user.supervisee_name}
                                        className="w-full h-auto" // Make image responsive within container
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {connectionStatus !== "Open" ? (
                    <div className="w-full flex flex-col gap-8 items-center justify-center">
                        <AnimatePresence>
                            <motion.div
                                initial="initial"
                                animate="enter"
                                exit="exit"
                                variants={{
                                    initial: { opacity: 0 },
                                    enter: { opacity: 1 },
                                    exit: { opacity: 0 },
                                }}
                            >
                                <Button
                                    disabled={
                                        creditsRemaining <= 0 ||
                                        !selectedUser ||
                                        !selectedToy
                                    }
                                    className={"z-50 flex items-center gap-1.5"}
                                    onClick={handleClickOpenConnection}
                                    size="sm"
                                >
                                    <span>
                                        <MoonStar
                                            size={16}
                                            strokeWidth={3}
                                            stroke={"currentColor"}
                                        />
                                    </span>
                                    <span className="text-md font-semibold">
                                        Play
                                    </span>
                                </Button>
                            </motion.div>
                        </AnimatePresence>
                        {/* <PickCharacter
                            allToys={allToys}
                            allPersonalities={allPersonalities}
                            selectedToy={selectedToy}
                            selectedUser={selectedUser}
                        /> */}
                    </div>
                ) : null}
            </div>

            <Messages
                messageHistory={messageHistory}
                selectedUser={selectedUser}
                selectedToy={selectedToy}
                emotionDictionary={emotionDictionary}
                handleScroll={handleScroll}
                isScrolledToBottom={isScrolledToBottom}
            />
            <ControlPanel
                connectionStatus={connectionStatus}
                isMuted={isMuted}
                muteMicrophone={muteMicrophone}
                unmuteMicrophone={unmuteMicrophone}
                handleClickInterrupt={handleClickInterrupt}
                handleClickCloseConnection={handleClickCloseConnection}
                microphoneStream={microphoneStream}
                audioBuffer={audioBuffer}
            />
        </div>
    );
};

export default Playground;
