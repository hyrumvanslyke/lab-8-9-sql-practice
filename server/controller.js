require('dotenv').config()
const Sequelize = require('sequelize')

const db = new Sequelize(process.env.CONNECTION_STRING)
module.exports = db
let nextEmp = 5
let userId = 4
module.exports = {
    getUpcomingAppointments: (req, res) => {
        db.query(`select a.appt_id, a.date, a.service_type, a.approved, a.completed, u.first_name, u.last_name 
        from cc_appointments a
        join cc_emp_appts ea on a.appt_id = ea.appt_id
        join cc_employees e on e.emp_id = ea.emp_id
        join cc_users u on e.user_id = u.user_id
        where a.approved = true and a.completed = false
        order by a.date desc;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },

    approveAppointment: (req, res) => {
        let {apptId} = req.body
        db.query(`UPDATE appointments SET approved = true WHERE appt_id = req.body
        INSERT INTO cc_emp_appts (emp_id, appt_id)
        VALUES (${nextEmp}, ${apptId}),
        (${nextEmp + 1}, ${apptId});
        `)
            .then(dbRes => {
                res.status(200).send(dbRes[0])
                nextEmp += 2
            })
            .catch(err => console.log(err))
    },
    getAllClients: (req, res) =>{
        db.query(`
        SELECT * FROM cc_clients AS c
        JOIN cc_users AS u
        ON c.user_id = u.user_id
        WHERE u.user_id = ${userId};
        `)
        .then((dbRes) => {
            res.status(200).send(dbRes[0])
        })
        .catch(err => console.log(err))
    },
    getPendingAppointments: (req,res) =>{
        db.query(`
        SELECT * FROM cc_appointments
        WHERE approved = false
        ORDER BY date DESC;
        `)
        .then((dbRes) => {
            res.status(200).send(dbRes[0])
        })
        .catch(err => console.log(err))
    },
    getPastAppointments: (req, res) =>{
        db.query(`
        SELECT a.appt_id, a.date, a.service_type, a.notes, u.first_name, u.last_name
        FROM cc_appointments a
        JOIN cc_emp_appts ea on a.appt_id = ea.appt_id
        JOIN cc_employees e on e.emp_id = ea.emp_id
        JOIN cc_users u on e.user_id = u.user_id
        WHERE a.approved = true AND a.completed = true
        ORDER BY a.date desc;
        `)
        .then((dbRes) => {
            res.status(200).send(dbRes[0])
        })
        .catch(err => console.log(err))
    },
    completeAppointment: (req, res) =>{
        let {apptId} = req.body
        db.query(`
        UPDATE appointments SET completed = true WHERE appt_id = req.body
        `)
        .then((dbRes) => {
            res.status(200).send(dbRes[0])
        })
        .catch(err => console.log(err))
    }
}
