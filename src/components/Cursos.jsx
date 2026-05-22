"use client";

import { supabase } from "@/app/utils/supabase/client";
import useCursoStore from "@/store/useCursoStore";
import { useEffect, useState } from "react";


export default function Cursos() {


    const cursos = useCursoStore((state) => state.cursos);

    const editarCurso = useCursoStore((state) => state.editarCurso);


    const [editandoId, setEditandoId] = useState(null);
    const setCursos = useCursoStore((state) => state.setCursos);

    const [formData, setFormData] = useState({
        nombre: "",
        modalidad: "",
    });


    useEffect(() => {

        const obtenerCursos = async () => {

            const { data, error } = await supabase
                .from("cursos")
                .select("*");

            if (error) {
                console.log(error);
                return;
            }

            console.log(data);

            setCursos(data);
        };

        obtenerCursos();

    }, [setCursos]);


    //  Guardar cambios en Supabase + Zustand
    const handleEditar = async (id) => {

        const { data, error } = await supabase
            .from("cursos")
            .update({
                nombre: formData.nombre,
                modalidad: formData.modalidad,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.log("Error:", error);
            return;
        }

        //  actualizar estado global
        editarCurso(data);

        // cerrar modo edición
        setEditandoId(null);
    };

    return (
        <div className="max-w-2xl mx-auto mt-10">

            <h2 className="text-2xl font-bold mb-5">
                Lista de Cursos
            </h2>

            <div className="space-y-4">

                {cursos.map((curso) => (

                    <div
                        key={curso.id}
                        className="bg-white p-5 rounded-xl shadow"
                    >


                        {editandoId === curso.id ? (
                            <>
                                <input
                                    className="border p-2 w-full mb-2"
                                    value={formData.nombre}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            nombre: e.target.value,
                                        })
                                    }
                                    placeholder="Título"
                                />

                                <textarea
                                    className="border p-2 w-full"
                                    value={formData.modalidad}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            modalidad: e.target.value,
                                        })
                                    }
                                    placeholder="modalidad"
                                />

                                <div className="mt-2 flex gap-2">

                                    <button
                                        onClick={() => handleEditar(curso.id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                        Guardar
                                    </button>

                                    <button
                                        onClick={() => setEditandoId(null)}
                                        className="bg-gray-400 text-white px-3 py-1 rounded"
                                    >
                                        Cancelar
                                    </button>

                                </div>
                            </>
                        ) : (
                            <>

                                <h3 className="text-xl font-semibold">
                                    {curso.nombre}
                                </h3>

                                <p className="text-gray-600 mt-2">
                                    {curso.modalidad}
                                </p>

                                <button
                                    onClick={() => {
                                        setEditandoId(curso.id);
                                        setFormData({
                                            nombre: curso.nombre,
                                            modalidad: curso.modalidad,
                                        });
                                    }}
                                    className="mt-3 bg-blue-500 text-white px-3 py-1 rounded"
                                >
                                    Editar
                                </button>
                            </>
                        )}

                    </div>
                ))}

            </div>
        </div>
    );
}