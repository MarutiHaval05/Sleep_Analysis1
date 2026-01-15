import React from 'react';
import Navigation from '../components/Navigation';
import { Play } from 'lucide-react';

const yogaPoses = [
    {
        "id": 1,
        "title": "Child’s Pose",
        "benefit": "Calms the nervous system, reduces anxiety, helps fall asleep faster.",
        "image_path": "/yoga/childs_pose.png"
    },
    {
        "id": 2,
        "title": "Legs Up the Wall",
        "benefit": "Lowers heart rate, reduces insomnia, deeply relaxing.",
        "image_path": "/yoga/legs_up_wall.jpg"
    },
    {
        "id": 3,
        "title": "Corpse Pose",
        "benefit": "Deep relaxation, improves sleep quality, reduces stress hormones.",
        "image_path": "/yoga/corpse_pose.png"
    },
    {
        "id": 4,
        "title": "Reclining Bound Angle",
        "benefit": "Relaxes hips, reduces emotional stress, supports deep breathing.",
        "image_path": "/yoga/reclining_bound_angle.png"
    },
    {
        "id": 5,
        "title": "Cat–Cow Pose",
        "benefit": "Releases spinal tension, synchronizes breath, reduces restlessness.",
        "image_path": "/yoga/cat_cow.jpg"
    },
    {
        "id": 6,
        "title": "Standing Forward Bend",
        "benefit": "Soothes the brain, quiets racing thoughts, eases anxiety.",
        "image_path": "/yoga/standing_forward_bend.png"
    },
    {
        "id": 7,
        "title": "Happy Baby Pose",
        "benefit": "Relaxes lower back, releases hips, improves sleep comfort.",
        "image_path": "/yoga/happy_baby.png"
    },
    {
        "id": 8,
        "title": "Bridge Pose",
        "benefit": "Reduces fatigue, calms nervous system, eases mild insomnia.",
        "image_path": "/yoga/bridge_pose.png"
    },
    {
        "id": 9,
        "title": "Supine Spinal Twist",
        "benefit": "Releases spine, improves digestion, induces calmness.",
        "image_path": "/yoga/supine_spinal_twist.png"
    },
    {
        "id": 10,
        "title": "Butterfly Pose",
        "benefit": "Relaxes pelvic region, reduces stress, prepares body for sleep.",
        "image_path": "/yoga/butterfly_pose.png"
    },
    {
        "id": 11,
        "title": "Thread-the-Needle Pose",
        "benefit": "Releases shoulder and neck tension, calms the nervous system, reduces stress-related sleep disturbances.",
        "image_path": "/yoga/thread_needle.png"
    },
    {
        "id": 12,
        "title": "Reclined Figure-Four Pose",
        "benefit": "Relieves hip and lower-back tightness, improves blood circulation, helps the body settle into rest.",
        "image_path": "/yoga/reclined_figure_four.png"
    },
    {
        "id": 13,
        "title": "Supported Bridge Pose",
        "benefit": "Opens chest and improves breathing, reduces fatigue and mild anxiety, encourages deeper, calmer sleep.",
        "image_path": "/yoga/supported_bridge.png"
    },
    {
        "id": 14,
        "title": "Side-Lying Relaxation Pose",
        "benefit": "Encourages side-sleeping, calms nervous system, useful for people who cannot sleep on the back.",
        "image_path": "/yoga/side_lying.png"
    },
    {
        "id": 15,
        "title": "Reclining Hero Pose",
        "benefit": "Deeply relaxes thighs and abdomen, slows breathing and heart rate, helpful for insomnia caused by stress.",
        "image_path": "/yoga/reclining_hero.png"
    },
    {
        "id": 16,
        "title": "Knees-to-Chest Pose",
        "benefit": "Relaxes lower back and spine, improves digestion before bedtime, reduces restlessness and bloating.",
        "image_path": "/yoga/knees_to_chest.png"
    }
];

const Yoga = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-12">
            <Navigation />

            <div className="max-w-[1600px] mx-auto px-6 pt-8">
                <header className="mb-10 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold text-[#0F172A] mb-4 font-heading">
                        Sleep-Inducing Yoga
                    </h1>
                    <p className="text-[#64748B] text-lg">
                        Gentle poses to calm your nervous system and prepare your body for deep, restorative sleep.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {yogaPoses.map((pose) => (
                        <div key={pose.id} className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_8px_24px_rgba(15,23,42,0.04)] overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col h-full">
                            <div className="relative h-64 overflow-hidden bg-slate-100">
                                <img
                                    src={pose.image_path}
                                    alt={pose.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Button removed as per user request */}
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-[#0F172A] mb-3 font-heading leading-tight">
                                    {pose.title}
                                </h3>
                                <p className="text-[#64748B] text-sm leading-relaxed flex-1">
                                    {pose.benefit}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Yoga;
