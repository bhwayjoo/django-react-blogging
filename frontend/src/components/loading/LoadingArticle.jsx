import { motion } from "framer-motion"; // Import Framer Motion

function LoadingArticle() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div
        className="h-10 w-10 rounded-full border-4 border-t-4 border-gray-300 border-t-blue-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export default LoadingArticle;
