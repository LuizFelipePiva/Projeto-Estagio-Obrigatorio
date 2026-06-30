// import icones

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaFileAlt } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";
import { IoIosPaper } from "react-icons/io";
import { FaPlus } from "react-icons/fa";

import logo from "../assets/logo.png";

const menuButtonClass = (active) =>
  `w-full text-left p-4 rounded transition-colors ${active
    ? "bg-white text-black display flex items-center gap-2"
    : "text-white hover:bg-white hover:text-black display flex items-center gap-2"
  }`;

export default function Sidebar({ isFreelancer }) {

  const location = useLocation();
  const navigate = useNavigate();

  const [jobsOpen, setJobsOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <aside className="w-64 bg-[#263544] pt-1 pb-3 px-3 flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div>
          <img src={logo} alt="Logo" className="w-full h-full -mt-8" />
        </div>

        {/* Links principais que aparecem em todas as telas privadas. */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className={menuButtonClass(isActive("/dashboard"))}
          >
            <FaHome />
            Tela Inicial
          </button>

          {isFreelancer ? (
            <>
              <button
                type="button"
                onClick={() => navigate("/curriculum")}
                className={menuButtonClass(isActive("/curriculum"))}
              >
                <FaFileAlt />
                Curriculo
              </button>

              <button
                type="button"
                onClick={() => navigate("/vagas-aplicadas")}
                className={menuButtonClass(isActive("/vagas-aplicadas"))}
              >
                <IoIosPaper />
                Vagas Aplicadas
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setJobsOpen(!jobsOpen)}
              className={`${menuButtonClass(isActive("/jobs"))} flex items-center justify-between`}
            >

              <span>Vagas</span>

              {jobsOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>

          )}
          {jobsOpen && (
            <div className="ml-6 mt-2 flex flex-col gap-2">

              <button
                onClick={() => navigate("/jobs")}
                className={"w-full text-left p-2 rounded hover:bg-gray-200 text-white hover:text-black flex gap-2 items-center"}
              >
                <IoIosPaper />
                Minhas vagas
              </button>

              <button
                onClick={() => navigate("/jobs/create")}
                className={"w-full text-left p-2 rounded hover:bg-gray-200 text-white hover:text-black flex gap-2 items-center"}
              >
                <FaPlus />
                Nova vaga
              </button>

            </div>
          )}
          <button
            onClick={() => navigate("/chat")}
            className={menuButtonClass(isActive("/chat"))}
          >
            <IoIosChatbubbles />
            Chat
          </button>
        </div>
      </div>

    </aside>
  );
}
