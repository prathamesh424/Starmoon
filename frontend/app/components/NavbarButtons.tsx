import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { LogIn, Home } from "lucide-react";

interface NavbarButtonsProps {
    user: User | null;
}

const ICON_SIZE = 18;
const STROKE_WIDTH = 3;

const NavbarButtons: React.FC<NavbarButtonsProps> = ({ user }) => {
    return user ? (
        <div className="flex flex-row gap-2 items-center">
            <Link href="/home">
                <Button
                    variant="link"
                    size="sm"
                    className="font-medium flex flex-row items-center gap-2 "
                >
                    <Home size={ICON_SIZE} />
                    <span className="hidden md:inline">Home</span>
                </Button>
            </Link>
        </div>
    ) : (
        <Link href="/login">
            <Button
                variant="link"
                size="sm"
                className="font-medium flex flex-row items-center gap-2 "
            >
                <LogIn size={ICON_SIZE} strokeWidth={STROKE_WIDTH} />
                <span className="hidden sm:block">Play Online</span>
            </Button>
        </Link>
    );
};

export default NavbarButtons;
