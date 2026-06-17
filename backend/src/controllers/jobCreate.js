import db from '../config/db.js';

export const createJob = async (req, res) => {

   const {
        title,
        category,
        modality,
        salary,
        location,
        description,
        requirements,
        data_final,
    } = req.body.formData;

    console.log(title, category, modality, salary, location, description, requirements, data_final);

    try {
        const id_user = req.user.id; 
        const [result] = await db.query(
            'INSERT INTO vagas (id_user, title, category, modality, salary, location, data_final, description, requirements)' +
            ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id_user, title, category, modality, salary, location, data_final, description, requirements]
        );
        res.status(201).json({ message: "Vaga criada com sucesso", job: result });
    } catch (error) {
        console.error("Erro ao criar vaga:", error);
        res.status(500).json({ message: "Erro ao criar vaga" });
    }

}