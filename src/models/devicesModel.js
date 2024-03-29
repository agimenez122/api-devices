import { getDevicesQuery, insertDevicesQuery, modifyDevicesQuery, deleteDevicesQuery, countDevicesQuery } from "../repositories/devicesRepository.js"
import moment from 'moment'
import mysql from "../adapters/mysql.js"
import { v4 as uuidv4 } from 'uuid'

const getDevicesModel = ({ conn, ...rest }) => {
	const now = moment.utc().format('YYYY-MM-DD HH:mm:ss')
	const paramsToSearch = { ...rest, now }

	return mysql
		.execute(getDevicesQuery(paramsToSearch), conn, paramsToSearch)
        .then(Result => Result.map(({id, ...resultFiltered }) => resultFiltered))
}

const countDevicesModel = ({ conn, ...rest }) => {
	const now = moment.utc().format('YYYY-MM-DD HH:mm:ss')
	const paramsToSearch = { ...rest, now }

	return mysql
		.execute(countDevicesQuery(paramsToSearch), conn, paramsToSearch)
		.then(results => results[0].count)
}

const insertDevicesModel = ({ conn, ...params }) => {
	const uuid = uuidv4()
	const now = moment.utc().format('YYYY-MM-DD HH:mm:ss')

	const requiredFields = params.name && params.type && params.brand && params.model && params.registration_date && params.status
	
	if(!requiredFields) { 
		return Promise.resolve()
	}

	return mysql
			.execute(insertDevicesQuery({ ...params, uuid, now }), conn, { ...params, uuid, now })
			.then(queryResult => queryResult[1].map(({ ...resultFiltered }) => resultFiltered))
		
}

const modifyDevicesModel = ({ conn, ...params }) => {
	return mysql
		.execute(modifyDevicesQuery(params), conn, params)
		.then(queryResult => queryResult[1].map(({ id, ...resultFiltered }) => resultFiltered))
}

const deleteDevicesModel = ({ uuid, conn }) => {
	const params = { uuid }

	return mysql
		.execute(deleteDevicesQuery(params), conn, params)
}

export { getDevicesModel, insertDevicesModel, modifyDevicesModel, deleteDevicesModel, countDevicesModel }