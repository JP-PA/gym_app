import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import DashboardLayout from "../layouts/dashboardlayout.jsx";
import { routines } from "../data/routines.js";
import "./routines.css";

function ExerciseCard({ exercise }) {
    const [playing, setPlaying] = useState(false);

    return (
        <article className="exercise-card">
            <div className="exercise-media">
                {playing ? (
                    <iframe
                        title={`Demostración de ${exercise.name}`}
                        src={`https://www.youtube-nocookie.com/embed/${exercise.video}?autoplay=1`}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <button type="button" className="exercise-play" onClick={() => setPlaying(true)}>
                        <img src={`https://i.ytimg.com/vi/${exercise.video}/hqdefault.jpg`} alt="" loading="lazy" />
                        <span><FaPlay aria-hidden="true" /> Reproducir video<span className="sr-only"> de {exercise.name}</span></span>
                    </button>
                )}
            </div>
            <div className="exercise-details">
                <h3>{exercise.name}</h3>
                <dl>
                    <div><dt>Equipo</dt><dd>{exercise.equipment}</dd></div>
                    <div><dt>Series sugeridas</dt><dd>{exercise.volume}</dd></div>
                </dl>
                <details>
                    <summary>Cómo hacerlo</summary>
                    <ol>{exercise.steps.map(step => <li key={step}>{step}</li>)}</ol>
                </details>
                <a href={`https://www.youtube.com/watch?v=${exercise.video}`} target="_blank" rel="noreferrer">Abrir video en YouTube</a>
            </div>
        </article>
    );
}

export default function Routines() {
    const [groupId, setGroupId] = useState(routines[0].id);
    const group = routines.find(routine => routine.id === groupId);

    return (
        <DashboardLayout>
            <header className="header-container">
                <div>
                    <h1>Rutinas</h1>
                    <p className="page-description">Elige un grupo muscular para ver ejercicios, series sugeridas y videos de técnica.</p>
                </div>
            </header>
            <div className="routine-filters" role="group" aria-label="Grupo muscular">
                {routines.map(routine => (
                    <button
                        key={routine.id}
                        type="button"
                        aria-pressed={routine.id === groupId}
                        onClick={() => setGroupId(routine.id)}
                    >
                        {routine.name}
                    </button>
                ))}
            </div>
            <section aria-labelledby="routine-title">
                <h2 id="routine-title" className="routine-title" aria-live="polite">{group.name}</h2>
                <div className="exercise-grid">
                    {group.exercises.map(exercise => <ExerciseCard key={exercise.video} exercise={exercise} />)}
                </div>
            </section>
        </DashboardLayout>
    );
}
