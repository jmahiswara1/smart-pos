import { motion } from 'framer-motion';

interface SlideTransitionProps {
    children: React.ReactNode;
    className?: string;
}

export default function SlideTransition({ children, className }: SlideTransitionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
