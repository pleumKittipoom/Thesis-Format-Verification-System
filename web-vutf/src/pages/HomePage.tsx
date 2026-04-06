import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { Link } from 'react-router-dom';

export const HomePage = () => {
    const [count, setCount] = useState(0)

    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="glass-panel p-12 text-center max-w-2xl w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

                <div className="absolute top-6 right-6 z-10">
                    <Link to="/login">
                        <Button variant="secondary">
                            Log In
                        </Button>
                    </Link>
                </div>

                <h1 className="gradient-text text-6xl mb-6 font-heading font-bold">
                    VUTF Web
                </h1>

                <p className="text-xl text-text-muted mb-8 leading-relaxed">
                    Professional React + TypeScript Architecture
                    <br />
                    <span className="text-sm opacity-75">Powered by Vite</span>
                </p>

                <div className="flex gap-4 justify-center mb-8">
                    <Button onClick={() => setCount(c => c + 1)}>
                        Count is {count}
                    </Button>
                    <Button variant="secondary" onClick={() => setCount(0)}>
                        Reset
                    </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-left mt-12">
                    <div className="p-4 rounded-lg bg-white/5">
                        <h3 className="font-bold mb-2 text-blue-400">Components</h3>
                        <p className="text-xs text-text-muted">Atomic design structure for maximum reusability.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5">
                        <h3 className="font-bold mb-2 text-purple-400">Hooks</h3>
                        <p className="text-xs text-text-muted">Custom hooks for cleaner logic separation.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5">
                        <h3 className="font-bold mb-2 text-pink-400">Types</h3>
                        <p className="text-xs text-text-muted">Strict TypeScript definitions for safety.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
