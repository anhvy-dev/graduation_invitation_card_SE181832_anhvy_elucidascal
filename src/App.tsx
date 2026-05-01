import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Calendar,
  MapPin,
  Send,
  ArrowRight,
  Music2,
  GraduationCap,
  BookOpen,
  Trophy,
  Star,
  Scroll,
  Volume2,
  VolumeX,
} from "lucide-react";

// --- Constants & Types ---

type AppStep = "INTRO" | "CHOICE" | "STORY" | "INVITATION";
type Emotion =
  | "neutral"
  | "happy"
  | "sad"
  | "stressed"
  | "excited"
  | "surprised"
  | "joy"
  | "left"
  | "right"
  | "fullview"
  | "tired";

interface Scene {
  id: number;
  text: string;
  emotion: Emotion;
  bg: string;
}

const CHARACTER_IMAGES: Record<Emotion, string> = {
  neutral: "/assets/walking.png",
  happy: "/assets/happy.png",
  sad: "/assets/sad.png",
  stressed: "/assets/stressed.png",
  excited: "/assets/yayyyy.png",
  surprised: "/assets/surprised.png",
  joy: "/assets/excited graduation.png",
  left: "/assets/left.png",
  right: "/assets/right.png",
  fullview: "/assets/full view.png",
  tired: "/assets/tired.png",
};

const PetalEffect = () => {
  const petals = Array.from({ length: 15 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {petals.map((_, i) => (
        <motion.div
          key={i}
          className="petal"
          initial={{
            top: -20,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 15 + 10}px`,
            height: `${Math.random() * 15 + 10}px`,
            rotate: 0,
            opacity: 0,
          }}
          animate={{
            top: "110%",
            left: `${Math.random() * 100 + (Math.random() * 20 - 10)}%`,
            rotate: 720,
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 20,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

const STORY_SCENES: Scene[] = [
  {
    id: 1,
    text: "Mọi thứ bắt đầu từ ngày nhập học đầu tiên. Một khởi đầu mới đầy hy vọng và những lời hứa hẹn tại Đại học FPT...",
    emotion: "neutral",
    bg: "bg-emerald-50",
  },
  {
    id: 2,
    text: "Ký ức về một tháng tuyệt vời tại Malaysia! Những trải nghiệm quốc tế đầu tiên, những người bạn mới và những bài học không bao giờ quên.",
    emotion: "happy",
    bg: "bg-blue-50",
  },
  {
    id: 3,
    text: "Năm nhất trôi qua thật nhanh với những phát hiện thú vị về chuyên ngành và những đêm miệt mài bên giáo trình.",
    emotion: "happy",
    bg: "bg-indigo-50",
  },
  {
    id: 4,
    text: "Năm hai, thử thách thực sự bắt đầu. Những đồ án chuyên ngành khó nhằn, những lần deadline 'dí' sát nút...",
    emotion: "stressed",
    bg: "bg-orange-50",
  },
  {
    id: 5,
    text: "Năm ba, giai đoạn bứt phá và tìm kiếm định hướng nghề nghiệp. Những kiến thức thực tế bắt đầu được hình thành rõ nét.",
    emotion: "neutral",
    bg: "bg-sky-50",
  },
  {
    id: 6,
    text: "Năm bốn, chặng hành trình cuối cùng. Những nỗ lực không ngừng nghỉ để chuẩn bị cho đồ án tốt nghiệp quan trọng nhất cuộc đời sinh viên.",
    emotion: "stressed",
    bg: "bg-indigo-900/10",
  },
  {
    id: 7,
    text: "Và giờ đây, mình đã ở đây! Bằng tốt nghiệp, áo cử nhân, và sự khởi đầu của một chương hoàn toàn mới. Mình đã làm được rồi! 🎓",
    emotion: "joy",
    bg: "bg-rose-50",
  },
];

const MILESTONES = [
  "Nhập Học",
  "Malaysia",
  "Năm nhất",
  "Năm 2",
  "Năm 3",
  "Năm 4",
  "Tốt nghiệp",
];

const JourneyProgressBar = ({ currentStep }: { currentStep: number }) => {
  const progress = (currentStep / (MILESTONES.length - 1)) * 100;

  return (
    <div className="w-full max-w-4xl px-4 pt-10 pb-6">
      <div className="relative w-full flex flex-col items-center gap-2">
        {/* Walking Indicator */}
        <motion.div
          className="w-16 h-16 pointer-events-none z-10"
          animate={{ x: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ transform: "translateX(-50%)" }}
        >
          <img
            src="/assets/SmoothWalk.gif"
            alt="Walking indicator"
            className="w-full h-full object-contain drop-shadow-md translate-y-1"
            onError={(e) => {
              // Fallback if the gift isn't loaded correctly
              e.currentTarget.style.display = "none";
            }}
          />
        </motion.div>

        <div className="relative h-1 bg-pink-100 rounded-full w-full">
          {/* Progress Fill */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-pink-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />

          {/* Milestone Dots and Labels */}
          <div className="absolute top-0 left-0 w-full flex justify-between">
            {MILESTONES.map((label, index) => (
              <div key={index} className="relative flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full -translate-y-1 transition-colors duration-300 border-2 ${
                    index <= currentStep
                      ? "bg-pink-500 border-pink-200"
                      : "bg-white border-pink-100"
                  }`}
                />
                <span
                  className={`absolute top-4 text-[10px] whitespace-nowrap font-medium tracking-tight transition-colors duration-300 ${
                    index === currentStep
                      ? "text-pink-600 font-bold"
                      : "text-slate-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const Character = ({
  emotion,
  className = "",
}: {
  emotion: Emotion;
  className?: string;
}) => {
  return (
    <div
      className={`relative transition-all duration-500 transform ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={emotion}
          src={CHARACTER_IMAGES[emotion]}
          alt={`Character emotion: ${emotion}`}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 1.1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full h-full object-contain drop-shadow-2xl"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
      {/* Decorative Shadow Blur */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/10 blur-xl rounded-full" />
    </div>
  );
};

const TypewriterText = ({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [index, text, onComplete]);

  return <span>{displayedText}</span>;
};

// --- Main App ---

export default function App() {
  const [step, setStep] = useState<AppStep>("INTRO");

  const INTRO_VIDEO_ID = "6k21sSDavWU";
  const INVITATION_VIDEO_ID = "b0A0d_Q8I40";
  const isInvitationTrack = step === "INVITATION";
  const YOUTUBE_VIDEO_ID = isInvitationTrack
    ? INVITATION_VIDEO_ID
    : INTRO_VIDEO_ID;
  const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&autoplay=1&mute=1&controls=0&loop=1&playlist=${YOUTUBE_VIDEO_ID}&rel=0&modestbranding=1&iv_load_policy=3`;
  const SONG_TITLE = isInvitationTrack
    ? "#14 Happy Journey | Genshin Impact"
    : "Moon in One's Cup";
  const SONG_ARTIST = isInvitationTrack ? "Genshin Impact" : "Yu-Peng Chen";

  const [userName, setUserName] = useState("");
  const [tempName, setTempName] = useState("");
  const [emotion, setEmotion] = useState<Emotion>("neutral");
  const [currentScene, setCurrentScene] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const youtubePlayerRef = useRef<HTMLIFrameElement | null>(null);

  const postYouTubeCommand = useCallback(
    (func: string, args: unknown[] = []) => {
      const playerWindow = youtubePlayerRef.current?.contentWindow;
      if (!playerWindow) return;

      playerWindow.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "*",
      );
    },
    [],
  );

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setStep("INVITATION");
      setEmotion("joy");
    }

    const saved = localStorage.getItem("graduate_visitor_name");
    if (saved) {
      setUserName(saved);
      setTempName(saved);
    }
  }, []);

  useEffect(() => {
    postYouTubeCommand(isAudioOn ? "unMute" : "mute");
    if (isAudioOn) {
      postYouTubeCommand("playVideo");
    }
  }, [isAudioOn, postYouTubeCommand]);

  const startGraduation = () => {
    if (!tempName.trim()) return;
    setUserName(tempName);
    localStorage.setItem("graduate_visitor_name", tempName);
    setEmotion("fullview");
    setStep("CHOICE");
  };

  const nextScene = () => {
    if (currentScene < STORY_SCENES.length - 1) {
      const nextIdx = currentScene + 1;
      setCurrentScene(nextIdx);
      setEmotion(STORY_SCENES[nextIdx].emotion);
      setIsTypingComplete(false);
    } else {
      setEmotion("joy");
      setStep("INVITATION");
    }
  };

  const handleChoice = (choice: "INVITE" | "STORY") => {
    if (choice === "STORY") {
      setStep("STORY");
      setEmotion(STORY_SCENES[0].emotion);
    } else {
      setStep("INVITATION");
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden sky-gradient font-sans selection:bg-pink-100">
      <button
        onClick={() => setIsAudioOn((prev) => !prev)}
        className="fixed top-5 right-5 z-50 px-4 py-2 rounded-full glass accent-border shadow-lg flex items-center gap-2 text-sm font-semibold text-slate-700 hover:bg-white/80 transition-colors"
        aria-label={isAudioOn ? "Tắt nhạc nền" : "Bật nhạc nền"}
      >
        {isAudioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        {isAudioOn ? "Tắt nhạc" : "Bật nhạc"}
      </button>

      <div className="fixed bottom-5 right-5 z-40">
        <div className="rounded-2xl glass accent-border px-4 py-3 shadow-2xl">
          <p className="text-[11px] tracking-wide uppercase text-slate-500 flex items-center gap-1">
            <Music2 size={12} /> Track
          </p>
          <p className="text-sm font-semibold text-slate-700">{SONG_TITLE}</p>
          <p className="text-xs text-slate-500">{SONG_ARTIST}</p>
        </div>
      </div>

      <iframe
        ref={youtubePlayerRef}
        title="Graduation intro music player"
        src={YOUTUBE_EMBED_URL}
        className="fixed w-px h-px opacity-0 pointer-events-none -left-[9999px] -top-[9999px]"
        allow="autoplay; encrypted-media"
        onLoad={() => {
          postYouTubeCommand(isAudioOn ? "unMute" : "mute");
          postYouTubeCommand("playVideo");
        }}
      />

      <AnimatePresence>
        {(step === "CHOICE" || step === "INVITATION") && <PetalEffect />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* Step 1: Intro / Name Input */}
        {step === "INTRO" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-md text-center space-y-12"
            >
              <div className="relative inline-block">
                <div className="w-40 h-40 md:w-44 md:h-44 mx-auto -mb-2 chibi-float">
                  <Character emotion="tired" />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="glass accent-border px-6 py-3 rounded-2xl shadow-xl absolute -top-4 -right-50 max-w-[180px] text-sm font-medium text-slate-700"
                >
                  "Ơ khoan đã!!! Tên bạn là gì nhỉ? 😊"
                </motion.div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs tracking-[0.3em] accent-text uppercase mb-2">
                    Đăng ký
                  </p>
                  <input
                    type="text"
                    placeholder="Tên của bạn..."
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && startGraduation()}
                    className="w-full px-8 py-5 text-center text-xl font-medium bg-white/40 border border-pink-100 rounded-2xl focus:border-pink-400 outline-none transition-all text-slate-800 placeholder-slate-400"
                  />
                </div>
                <button
                  onClick={startGraduation}
                  disabled={!tempName.trim()}
                  className="w-full py-5 bg-pink-500 text-white rounded-2xl font-bold text-lg hover:bg-pink-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_10px_30px_rgba(236,72,153,0.2)] flex items-center justify-center gap-2 group"
                >
                  Bắt đầu{" "}
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Step 2: Main Choice Interaction */}
        {step === "CHOICE" && (
          <motion.div
            key="choice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col justify-center px-6 py-10"
          >
            <div className="max-w-5xl mx-auto w-full flex flex-col items-center justify-center gap-12 md:gap-16 z-10">
              <div className="text-center space-y-4">
                <p className="text-xs tracking-[0.4em] accent-text uppercase opacity-70">
                  Niên khóa 2026
                </p>
                <h2 className="text-5xl md:text-6xl font-display italic text-slate-900 text-glow-pink">
                  Chào mừng, {userName}.
                </h2>
                <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
                  Trước khi khởi hành, bạn muốn tiếp tục với lựa chọn nào?
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-8 md:gap-10 w-full items-center justify-center">
                {/* Left Card: Invitation */}
                <motion.div
                  onMouseEnter={() => setEmotion("left")}
                  onMouseLeave={() => setEmotion("fullview")}
                  onClick={() => handleChoice("INVITE")}
                  whileHover={{ y: -10 }}
                  className="w-72 glass accent-border p-8 rounded-3xl cursor-pointer group transition-all h-[400px] flex flex-col justify-end relative overflow-hidden shadow-xl"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 font-display text-8xl text-pink-500">
                    01
                  </div>
                  <div className="space-y-4 relative z-10">
                    <div className="w-12 h-12 glass accent-border rounded-xl flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                      <Send
                        className="text-slate-600 group-hover:accent-text"
                        size={20}
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display italic text-slate-800 group-hover:accent-text transition-colors">
                        Xem thiệp mời
                      </h3>
                      <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                        Đi thẳng đến thông tin chi tiết và phản hồi lời mời.
                      </p>
                    </div>
                    <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden mt-4">
                      <div className="h-full w-1/3 bg-pink-400"></div>
                    </div>
                  </div>
                </motion.div>

                {/* Character Hub */}
                <div className="w-56 h-56 md:w-64 md:h-64 flex items-center justify-center chibi-float z-20">
                  <Character emotion={emotion} />
                </div>

                {/* Right Card: Journey */}
                <motion.div
                  onMouseEnter={() => setEmotion("right")}
                  onMouseLeave={() => setEmotion("fullview")}
                  onClick={() => handleChoice("STORY")}
                  whileHover={{ y: -10 }}
                  className="w-72 glass accent-border p-8 rounded-3xl cursor-pointer group transition-all h-[400px] flex flex-col justify-end relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 font-display text-8xl text-pink-500">
                    02
                  </div>
                  <div className="space-y-4 relative z-10">
                    <div className="w-12 h-12 glass accent-border rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <GraduationCap
                        className="text-slate-600 group-hover:blue-500"
                        size={20}
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display italic accent-text">
                        Hành trình của mình
                      </h3>
                      <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                        Nhìn lại những ký ức.
                      </p>
                    </div>
                    <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden mt-4">
                      <div className="h-full w-full bg-sky-400"></div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="w-full flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium opacity-50">
                <div className="flex gap-8">
                  <span>UID: SE181832</span>
                  <span>Server: K18_FPT University Ho Chi Minh</span>
                </div>
                <span>© 2026 The Graduate. All Rights Reserved.</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Story Mode */}
        {step === "STORY" && (
          <motion.div
            key={`story-${currentScene}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 flex flex-col items-center justify-end p-6 bg-sky-500/10 backdrop-blur-sm shadow-[inset_0_0_100px_rgba(255,255,255,0.4)]`}
          >
            <div className="absolute top-4 w-full max-w-4xl px-8 flex justify-center">
              <JourneyProgressBar currentStep={currentScene} />
            </div>

            <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
              <div className="w-64 h-64 md:w-[350px] md:h-[350px] chibi-float relative z-0">
                <Character emotion={emotion} />
              </div>
            </div>

            {/* Narrative Dialog Box */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-4xl glass accent-border p-8 md:p-12 rounded-3xl mb-8 relative shadow-2xl"
            >
              <div className="absolute -top-5 left-12 glass accent-border text-pink-600 px-6 py-1.5 rounded-full font-bold shadow-lg text-sm tracking-widest uppercase">
                Nhà lữ hành {userName}
              </div>
              <div className="min-h-[100px] text-lg md:text-xl text-slate-700 leading-relaxed font-light">
                <TypewriterText
                  text={STORY_SCENES[currentScene].text}
                  onComplete={() => setIsTypingComplete(true)}
                />
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={nextScene}
                  className={`px-8 py-3 rounded-2xl font-bold bg-pink-500 text-white flex items-center gap-3 transition-all ${isTypingComplete ? "opacity-100 scale-100 shadow-[0_10px_30px_rgba(236,72,153,0.3)]" : "opacity-20 scale-95 pointer-events-none"}`}
                >
                  {currentScene === STORY_SCENES.length - 1
                    ? "Kết thúc chu kỳ ký ức"
                    : "Ký ức tiếp theo"}
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Step 4: Final Invitation Card */}
        {step === "INVITATION" && (
          <motion.div
            key="invitation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center sky-gradient p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 25 }}
              className="w-full max-w-xl glass accent-border rounded-[3rem] p-1 shadow-[0_20px_100px_rgba(219,39,119,0.1)] overflow-hidden"
            >
              <div className="rounded-[2.8rem] p-8 md:p-12 space-y-12">
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-4 accent-text font-display font-medium tracking-[0.3em] uppercase text-xs"
                  >
                    <div className="h-px w-8 bg-pink-300" /> Thư mời chính thức{" "}
                    <div className="h-px w-8 bg-pink-300" />
                  </motion.div>
                  <div className="flex justify-center gap-4 py-2">
                    <motion.div
                      initial={{ rotate: -20, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <GraduationCap className="accent-text" size={24} />
                    </motion.div>
                    <motion.div
                      initial={{ rotate: 20, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <Trophy className="text-yellow-500" size={24} />
                    </motion.div>
                    <motion.div
                      initial={{ rotate: -20, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 1.1 }}
                    >
                      <Star className="text-yellow-400" size={24} />
                    </motion.div>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-display italic text-slate-900 text-glow-pink">
                    Lễ Tốt Nghiệp
                  </h1>
                  <p className="text-slate-500 font-light tracking-widest text-xs uppercase italic">
                    Lễ kỷ niệm Niên khóa 2026
                  </p>
                </div>

                <div className="space-y-10">
                  <div className="text-center">
                    <p className="text-pink-600/60 font-medium uppercase tracking-[0.2em] text-[10px] mb-2">
                      Thân mời
                    </p>
                    <p className="text-3xl font-display italic text-slate-800">
                      {userName || "Nhà lữ hành đặc biệt"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 glass accent-border rounded-2xl flex items-center gap-4">
                      <div className="w-10 h-10 glass accent-border rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="accent-text" size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Thời gian
                        </p>
                        <p className="font-medium text-slate-700 italic">
                          Ngày 15 tháng 11, 2026
                        </p>
                      </div>
                    </div>

                    <a
                      href="https://www.google.com/maps/search/?api=1&query=FPT+University+HCMC"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-6 glass accent-border rounded-2xl flex items-center gap-4 hover:bg-pink-50/50 transition-colors group"
                    >
                      <div className="w-10 h-10 glass accent-border rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-pink-100 transition-colors">
                        <MapPin className="accent-text" size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Địa điểm (nhấn để xem bản đồ)
                        </p>
                        <p className="font-medium text-slate-700 italic group-hover:accent-text transition-colors">
                          Đại học FPT, TP. Hồ Chí Minh
                        </p>
                      </div>
                    </a>
                  </div>

                  <div className="p-8 rounded-2xl space-y-2 text-center border-y border-pink-100 bg-white/20">
                    <p className="text-slate-500 text-sm leading-relaxed font-light italic">
                      “Bất kể bạn là ai, khi nhận được lời mời này, bạn đã là
                      một phần quan trọng trong hành trình đầy ước mơ, thử thách
                      và những lần vấp ngã của mình — nơi mỗi ký ức đều mang dấu
                      ấn của những người đã từng bước qua cuộc đời mình, trong
                      đó có bạn.”
                      <br />
                      “Whoever you are, by receiving this invitation, you have
                      already been an important part of my journey — a journey
                      filled with dreams, challenges, and stumbles, where every
                      memory carries the imprint of those who have walked
                      through my life, including you.”
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-6 items-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-5 bg-pink-500 text-white rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgba(236,72,153,0.3)] flex items-center justify-center gap-2 group"
                  >
                    Xác nhận tham gia{" "}
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  <button
                    onClick={() => setStep("CHOICE")}
                    className="text-slate-400 hover:accent-text font-medium transition-colors text-xs tracking-widest uppercase"
                  >
                    Quay lại điều hướng
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent UI Elements */}
      <div className="fixed bottom-0 left-0 p-8 flex items-center gap-4 pointer-events-none opacity-40 select-none">
        <div className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_10px_#f472b6]" />
        <div className="h-px w-24 bg-pink-200" />
        <span className="text-[10px] font-display italic tracking-[0.3em] text-slate-500 uppercase">
          Mảnh ghép: Tốt nghiệp
        </span>
      </div>
    </div>
  );
}
