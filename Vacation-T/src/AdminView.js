import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

class AdminView extends Component {
  constructor() {
    super();
    this.state = {
      vacationRequests: [],
      approvedRequests: [],
      rejectedRequests: [],
      error: null,
      success: null,
    };
  }

  componentDidMount() {
    this.updateRequestList('vacationRequests', 'https://us-west-2.data.tidbcloud.com/api/v1beta/app/dataapp-lkmSFSgw/endpoint/vacas_pendientes');
    this.updateRequestList('approvedRequests', 'https://us-west-2.data.tidbcloud.com/api/v1beta/app/dataapp-lkmSFSgw/endpoint/vacas_aprobadas');
    this.updateRequestList('rejectedRequests', 'https://us-west-2.data.tidbcloud.com/api/v1beta/app/dataapp-lkmSFSgw/endpoint/vacas_rechazadas');
  }

  updateRequestList = (stateKey, url) => {
    axios.get(url, {
      auth: {
        username: 'S0O3QIO0',
        password: 'e77eab98-1692-4608-9f06-db88f9686305',
      },
    })
      .then(response => {
        this.setState({ [stateKey]: response.data.data.rows });
      })
      .catch(error => {
        this.setState({ error: `Error al obtener las solicitudes de ${stateKey}`, success: null });
      });
  }

  handleApproveRequest = (requestId) => {
    axios.post('https://us-west-2.data.tidbcloud.com/api/v1beta/app/dataapp-lkmSFSgw/endpoint/aprobar_vacas', { "id": requestId }, {
      auth: {
        username: 'S0O3QIO0',
        password: 'e77eab98-1692-4608-9f06-db88f9686305',
      },
    })
      .then(response => {
        this.setState({ success: 'Solicitud aprobada con éxito', error: null });
        this.updateRequestList('vacationRequests', 'https://us-west-2.data.tidbcloud.com/api/v1beta/app/dataapp-lkmSFSgw/endpoint/vacas_pendientes');
        this.updateRequestList('approvedRequests', 'https://us-west-2.data.tidbcloud.com/api/v1beta/app/dataapp-lkmSFSgw/endpoint/vacas_aprobadas');
      })
      .catch(error => {
        this.setState({ error: 'Error al aprobar la solicitud de vacaciones', success: null });
      });
  }

  handleRejectRequest = (requestId) => {
    axios.post('https://us-west-2.data.tidbcloud.com/api/v1beta/app/dataapp-lkmSFSgw/endpoint/denegar_vacas', { "id": requestId }, {
      auth: {
        username: 'S0O3QIO0',
        password: 'e77eab98-1692-4608-9f06-db88f9686305',
      },
    })
      .then(response => {
        this.setState({ success: 'Solicitud rechazada con éxito', error: null });
        this.updateRequestList('vacationRequests', 'https://us-west-2.data.tidbcloud.com/api/v1beta/app/dataapp-lkmSFSgw/endpoint/vacas_pendientes');
        this.updateRequestList('rejectedRequests', 'https://us-west-2.data.tidbcloud.com/api/v1beta/app/dataapp-lkmSFSgw/endpoint/vacas_rechazadas');
      })
      .catch(error => {
        this.setState({ error: 'Error al rechazar la solicitud de vacaciones', success: null });
      });
  }

  render() {
    const { vacationRequests, approvedRequests, rejectedRequests, error, success } = this.state;

    return (
      <div className="container">
        <h2>Vista Admin</h2>
        <br></br>
        <h5>Solicitudes Pendientes</h5>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">E-Mail</th>
              <th scope="col">Teléfono</th>
              <th scope="col">Fecha Solicitada</th>
              <th scope="col">Fecha Inicio</th>
              <th scope="col">Fecha Final</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vacationRequests.map(request => (
              <tr key={request.id_solicitud}>
                <td>{request.nombre}</td>
                <td>{request.email}</td>
                <td>{request.telefono}</td>
                <td>{request.fecha_pedida}</td>
                <td>{request.fecha_inicio}</td>
                <td>{request.fecha_final}</td>
                <td>
                  <button className="btn btn-success" onClick={() => this.handleApproveRequest(request.id_solicitud)}>Aprobar</button>
                  <button className="btn btn-danger" onClick={() => this.handleRejectRequest(request.id_solicitud)}>Rechazar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br></br>

        <h5>Solicitudes Aprobadas</h5>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">E-Mail</th>
              <th scope="col">Teléfono</th>
              <th scope="col">Fecha Solicitada</th>
              <th scope="col">Fecha Inicio</th>
              <th scope="col">Fecha Final</th>
            </tr>
          </thead>
          <tbody>
            {approvedRequests.map(request => (
              <tr key={request.id_solicitud}>
                <td>{request.nombre}</td>
                <td>{request.email}</td>
                <td>{request.telefono}</td>
                <td>{request.fecha_pedida}</td>
                <td>{request.fecha_inicio}</td>
                <td>{request.fecha_final}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br></br>

        <h5>Solicitudes Rechazadas</h5>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">E-Mail</th>
              <th scope="col">Teléfono</th>
              <th scope="col">Fecha Solicitada</th>
              <th scope="col">Fecha Inicio</th>
              <th scope="col">Fecha Final</th>
            </tr>
          </thead>
          <tbody>
            {rejectedRequests.map(request => (
              <tr key={request.id_solicitud}>
                <td>{request.nombre}</td>
                <td>{request.email}</td>
                <td>{request.telefono}</td>
                <td>{request.fecha_pedida}</td>
                <td>{request.fecha_inicio}</td>
                <td>{request.fecha_final}</td>
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

export default AdminView;
