import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as actions from '../actions/project_actions'
import filter2D from './utils/filter2D'
class Main extends Component {
  componentDidMount () {
    this.props.fetchActiveProjects()
  }
  render () {


    //const subSearch =
    let { projects, search: { primary, secondary } } = this.props


    let childElements = filter2D(projects, primary, secondary).map((a) => {
      let tags = a.details.tags.map((b) => {
        return <p key={b} className="tag">{b}</p>
      })
      let description = a.details.description.slice(0,150)
      return (
        <div className="col-sm-4" key={a._id}>
          <div className="project">
            <div className="details">
              <p className="title">{a.details.title}</p>
              <p className="description">{description}</p>
              <hr className="spacer"></hr>
              { tags }
            </div>
            <div className="row bottom">
              <div className="col-sm-4">
                <p className="stat">{a.participants.count}/{a.details.options.max_members}</p>
                <p className="description">Members</p>
              </div>
              <div className="col-sm-4">
                <p className="stat">{a.details.age}</p>
                <p className="description">Days Old</p>
              </div>
              <div className="col-sm-4">
                <Link to="/me" className="inline btn btn-default btn-lg">Join!</Link>
              </div>
            </div>
          </div>
        </div>
      )
    })



    let options;
    if (this.props.search.primary == "age") {
      options = [
        <option key="newest" value="newest">newest</option>,
        <option key="oldest" value="oldest">oldest</option>
      ]
    } else if (this.props.search.primary == "language") {
      options = [
        <option key="javascript" value="javascript">javascript</option>,
        <option key="ruby" value="ruby">ruby</option>
      ]
    }


    return (
        <div className="container-fluid main">
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1 ">
              {/* Search form options*/}

              <div className="form-group">
                <label>Primary Search</label>
                <select className="form-control" value={this.props.search.primary}
                  onChange={ (e) => { this.props.primarySearch(e.target.value)} }>
                  <option key="age" value="age">age</option>
                  <option key="language" value="language">language</option>
                </select>
              </div>

              <div className="form-group">
                <label>Secondary Search</label>
                <select className="form-control" value={this.props.search.secondary}
                  onChange={ (e) => { this.props.secondarySearch(e.target.value)} }>
                  { options }
                </select>
              </div>
              <div className="row">
                  { childElements }
              </div>
           </div>
         </div>
        </div>
    )
  }
}


Main.propTypes = {
  fetchActiveProjects: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
  projects: state.projects.active,
  search: {
    primary: state.projects.primary,
    secondary: state.projects.secondary
  }
})



export default connect(mapStateToProps, actions)(Main);
