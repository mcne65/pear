import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
// components
import Member from '../Member'
import Applicant from '../Applicant'
import ProjectMessage from '../ProjectMessage'
// actions
import { postMessage, kickMember, approveApplicant } from '../../redux/modules/projects'
import { projectMessageChange } from '../../redux/modules/form'
// component
function ProjectOwnerCard ({ myID, projects, postMessage, projectMessageChange, value }) {
  // kick participant
  function handleKick(projectID) {
    return function(e) {
      e.preventDefault();
      kickMember({
        projectID,
        userID: e.target.name
      })
    }
  }
  // approve participant
  function handleApprove(projectID) {
    return function(e) {
      e.preventDefault();
      approveApplicant({
        projectID,
        userID: e.target.name
      })
    }
  }
  // send a new team messaage
  function handleSubmit(e) {
    e.preventDefault();

    postMessage({
      message: value,
      projectID: e.target.name
    })
  }
  // presentational elements
  let childElements = projects.map((a) => {
    const handleKickWithProjectID = handleKick(a._id)
    const approveWithProjectID = handleApprove(a._id)
    // members
    let memberElements = a.members.map((b) => <Member key={b.username} data={b} handleKick={handleKickWithProjectID} owner={true} /> )
    // applicants
    let applicantElements = a.applicants.map((b) => <Applicant key={b.username} data={b} handleKick={handleKickWithProjectID} handleApprove={approveWithProjectID} owner={true} /> )
    // messages
    let messageElements = a.messages.map((b,i) => <ProjectMessage key={i} data={b} />)



    // putting the pieces together
    return (
      <div key={a._id} className="project-card">
        <div className="row">
            <div className="col-sm-6">
              <h4 className="strong">{a.title} by {a.owner.username}</h4>
              <p>{a.description}</p>
              <p>{a.age} days old</p>
              <p>{a.count}/{a.options.max_members} members</p>
              <Link to={`/projects/${a._id}`}>Edit Project Details</Link>
            </div>
            <div className="col-sm-6">
              <h4>Message Board</h4>
              { messageElements }
              <textarea rows={5} placeholder="send messages about project details to the members of the project" value={value} onChange={(e) => {projectMessageChange(e.target.value)}} />
              <button className="block-elem" name={a._id} onClick={handleSubmit}>Post message to your team</button>
            </div>
        </div>


        <hr />
        <h4>Members</h4>
        { memberElements }
        <h4>Applicants</h4>
        { applicantElements }
      </div>
    )
  })
  return (
      <div>
        {childElements}
      </div>
  )
}

const mapStateToProps = (state) => {
  const myID = state.user._id;
  const projects = state.user.projects_as_owner
  return {
    myID,
    projects,
    value: state.form.project_message
  }
}

export default connect(mapStateToProps, { postMessage, projectMessageChange })(ProjectOwnerCard)
