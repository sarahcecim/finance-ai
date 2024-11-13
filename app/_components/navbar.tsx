import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
    return (  
        <nav className="flex justify-between">
            {/* ESQUERDA */}
            <Image src="/logo.svg" width={173} height={39} alt={"Finance AI"} />
            <Link href="/">Dashboard</Link>
        </nav>
    );
}
 
export default Navbar;