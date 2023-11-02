import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min';

class UserView extends Component {
  constructor() {
    super();
    this.state = {
      userData: null,
      availableVacationDays: null,
      selectedStartDate: '',
      selectedEndDate: '',
      vacationHistory: [],
      error: null,
      success: null,
      dni: '',
    };
  }

  componentDidMount() {
    if (this.state.dni) {
      this.fetchUserData();
      this.fetchVacationHistory();
    }
  }
  

  fetchUserData = () => {
    const { dni } = this.state;
    axios.get(`https://us-west-2.data.tidbcloud.com/api/v1beta/app/dataapp-lkmSFSgw/endpoint/user?dni=${dni}`, {
      auth: {
        username: 'S0O3QIO0',
        password: 'e77eab98-1692-4608-9f06-db88f9686305',
      },
    })
    .then(response => {
      const userData = response.data.data.rows[0];
      const availableVacationDays = userData.dias_de_vacaciones;
      this.setState({ userData, availableVacationDays, error: null });
    })
    .catch(error => {
      console.error('Error al obtener datos del usuario', error);
      this.setState({ userData: null, availableVacationDays: null, error: 'Error al obtener datos del usuario' });
    });
  }
  

  fetchVacationHistory = () => {
    const { dni } = this.state;
    axios.get(`https://us-west-2.data.tidbcloud.com/api/v1beta/app/dataapp-lkmSFSgw/endpoint/historial?dni=${dni}`, {
      auth: {
        username: 'S0O3QIO0',
        password: 'e77eab98-1692-4608-9f06-db88f9686305',
      },
    })
    .then(historyResponse => {
      const vacationHistory = historyResponse.data.data.rows;
      this.setState({ vacationHistory });
    })
    .catch(historyError => {
      console.error('Error al obtener el historial de vacaciones', historyError);
    });
  }

  handleDniChange = (event) => {
    this.setState({ dni: event.target.value });
  }

  handleStartDateChange = (event) => {
    this.setState({ selectedStartDate: event.target.value });
  }

  handleEndDateChange = (event) => {
    this.setState({ selectedEndDate: event.target.value });
  }

  handleRequestVacation = () => {
    const { selectedStartDate, selectedEndDate, vacationHistory, availableVacationDays, dni } = this.state;
  
    if (!dni) {
      this.setState({ error: 'DNI inválido', success: null });
      return;
    }
  
    const startDate = new Date(selectedStartDate);
    const endDate = new Date(selectedEndDate);
  
    if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
      this.setState({ error: 'Fechas inválidas', success: null });
      return;
    }
  
    const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
    if (durationInDays > availableVacationDays) {
      this.setState({ error: 'Días de vacaciones exceden el límite disponible', success: null });
      return;
    }
  
    const newAvailableVacationDays = availableVacationDays - durationInDays;
  
    const newVacation = {
      fecha_inicio: selectedStartDate,
      fecha_final: selectedEndDate,
      estado: 'Pendiente',
    };
  
    axios.post('https://us-west-2.data.tidbcloud.com/api/v1beta/app/dataapp-lkmSFSgw/endpoint/generar_vacas', newVacation, {
      auth: {
        username: 'S0O3QIO0',
        password: 'e77eab98-1692-4608-9f06-db88f9686305',
      },
    })
    .then(response => {
      this.setState(prevState => ({
        vacationHistory: [...prevState.vacationHistory, newVacation],
        availableVacationDays: newAvailableVacationDays,
        success: 'Solicitud enviada con éxito',
        error: null,
      }));
    })
    .catch(error => {
      this.setState({ error: 'Error al enviar la solicitud de vacaciones', success: null });
    });
  }
  

  render() {
    const { userData, availableVacationDays, vacationHistory, error, success } = this.state;

    return (
      <div className="container">
        <h2>Vista Usuario</h2>
        <br></br>

        <div className="form-group">
          <strong>DNI:</strong>
          <input
            type="text"
            className="form-control"
            value={this.state.dni}
            onChange={this.handleDniChange}
          />
          <br></br>
          <button className="btn btn-primary" onClick={this.fetchUserData}>
            Obtener Datos
          </button>
        </div>
        <br></br>

        {userData ? (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Información del Usuario</h5>
              <p className="card-text"><strong>Nombre y Apellido:</strong> {userData.nombre}</p>
              <p className="card-text"><strong>Correo electrónico:</strong> {userData.email}</p>
              <p className="card-text"><strong>Teléfono:</strong> {userData.telefono}</p>
              <p className="card-text"><strong>Dirección:</strong> {userData.direccion}</p>
              <p className="card-text"><strong>Puesto: </strong> {userData.posicion}</p>
              <p className="card-text"><strong>Días de vacaciones disponibles:</strong> {availableVacationDays}</p>
            </div>
          </div>
        ) : (
          <p>Cargando datos del usuario...</p>
        )}
        <br></br>
        <h3>Solicitar Vacaciones</h3>
        <div className="form-group">
          <strong>Desde:</strong>
          <input
            type="date"
            className="form-control"
            value={this.state.selectedStartDate}
            onChange={this.handleStartDateChange}
          />
        </div>
        <div className="form-group">
          <strong>Hasta:</strong>
          <input
            type="date"
            className="form-control"
            value={this.state.selectedEndDate}
            onChange={this.handleEndDateChange}
          />
        </div>
        <br></br>
        <button className="btn btn-primary" onClick={this.handleRequestVacation}>
          Solicitar Vacaciones
        </button>
        <br></br>
        <br></br>
        <h3>Historial de Vacaciones</h3>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Fecha Solicitada</th>
              <th scope="col">Fecha Inicio</th>
              <th scope="col">Fecha Final</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {vacationHistory.map(vacation => (
              <tr key={vacation.id_solicitud}>
                <td>{vacation.fecha_pedida}</td>
                <td>{vacation.fecha_inicio}</td>
                <td>{vacation.fecha_final}</td>
                <td>{vacation.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
      </div>
    );
  }
}

export default UserView;
