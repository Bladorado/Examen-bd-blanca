import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCursoStore = create(

    persist(

        (set) => ({

            cursos: [],

            agregarCurso: (nuevaCurso) =>
                set((state) => ({
                    cursos: [...state.cursos, nuevaCurso],
                })),

            editarCurso: (cursoActualizada) =>
                set((state) => ({
                    cursos: state.cursos.map((curso) =>
                        curso.id === cursoActualizada.id ? cursoActualizada : curso
                    ),
                })),
                
        }),

        {
            name: "cursos-storage",
        }

    )
);


export default useCursoStore;