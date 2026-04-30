import React from "react";
import SearchIndexItem from "./search_index_item";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

class SearchIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category_id: "",
      location: "Earth",
      filter: "Magic",
      searchTerm: "",
      filtprojects: "",
      dropdown: "All Categories",
      dropdowntwo: "Earth",
      dropdownthree: "Magic",
      catbox: "hidden",
      catboxtwo: "hidden",
      catboxthree: "hidden",
      formColor: "",
      formColorTwo: "",
      formColorThree: "",
      svg: "arrow",
      svgTwo: "arrow",
      svgThree: "arrow",
      loading: true
    };
    this.searchFilter = this.searchFilter.bind(this);
    this.checkProj = this.checkProj.bind(this);
    this.updatedrop = this.updatedrop.bind(this);
    this.updateDropTwo = this.updateDropTwo.bind(this);
    this.updateDropThree = this.updateDropThree.bind(this);
    this.updateSearchTerm = this.updateSearchTerm.bind(this);
    this.projectMatchesKeyword = this.projectMatchesKeyword.bind(this);
    this.categoryLabelFromId = this.categoryLabelFromId.bind(this);
  }

  componentDidMount() {
    const routeState = this.props.location.state;
    const urlParams = new URLSearchParams(this.props.location.search);
    const queryTerm = urlParams.get("q") || "";

    this.props.fetchProjects().then(() => {
      const nextState = { filtprojects: this.props.projects, searchTerm: queryTerm };

      if (typeof routeState !== "undefined") {
        if (routeState.category_id !== undefined) {
          nextState.category_id = routeState.category_id;
          nextState.dropdown = this.categoryLabelFromId(routeState.category_id);
          nextState.svg = routeState.category_id === "" ? "arrow" : "times";
        }

        if (routeState.location !== undefined) {
          nextState.location = routeState.location;
          nextState.dropdowntwo = routeState.location;
          nextState.svgTwo = routeState.location === "Earth" ? "arrow" : "times";
        }

        if (routeState.filter !== undefined && routeState.filter !== "") {
          nextState.filter = routeState.filter;
          nextState.dropdownthree = routeState.filter;
          nextState.svgThree = routeState.filter === "Magic" ? "arrow" : "times";
        }
      }

      this.setState(nextState, () => {
        this.searchFilter(this.props.projects);
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.projects !== this.props.projects) {
      this.searchFilter(this.props.projects);
      return;
    }

    if (
      this.props.location.state !== prevProps.location.state &&
      typeof this.props.location.state !== "undefined"
    ) {
      const routeState = this.props.location.state;
      const nextState = {};

      if (routeState.category_id !== undefined) {
        nextState.category_id = routeState.category_id;
        nextState.dropdown = this.categoryLabelFromId(routeState.category_id);
        nextState.svg = routeState.category_id === "" ? "arrow" : "times";
      }

      if (routeState.location !== undefined) {
        nextState.location = routeState.location;
        nextState.dropdowntwo = routeState.location;
        nextState.svgTwo = routeState.location === "Earth" ? "arrow" : "times";
      }

      if (routeState.filter !== undefined && routeState.filter !== "") {
        nextState.filter = routeState.filter;
        nextState.dropdownthree = routeState.filter;
        nextState.svgThree = routeState.filter === "Magic" ? "arrow" : "times";
      }

      this.setState(nextState, () => this.searchFilter(this.props.projects));
    }

    if (this.props.location.search !== prevProps.location.search) {
      const urlParams = new URLSearchParams(this.props.location.search);
      const queryTerm = urlParams.get("q") || "";
      this.setState({ searchTerm: queryTerm }, () => this.searchFilter(this.props.projects));
    }
  }

  searchFilter(projects) {
    const sourceProjects = Array.isArray(projects) ? [...projects] : [];
    let results = sourceProjects;

    if (this.state.category_id !== "") {
      results = results.filter(
        project => String(this.state.category_id) === String(project.category_id)
      );
    }

    if (this.state.location !== "Earth") {
      results = results.filter(
        project => this.state.location === project.location
      );
    }

    if (this.state.filter === "Projects We Love") {
      results = results.filter(project => project.loved === true);
    } else if (this.state.filter === "Newest") {
      results = [...results].sort((a, b) => b.days_left - a.days_left);
    } else if (this.state.filter === "Most Funded") {
      results = [...results].sort(
        (a, b) =>
          b.total_pledged / b.goal_amount - a.total_pledged / a.goal_amount
      );
    } else if (this.state.filter === "Random") {
      results = [...results].sort(() => Math.random() - 0.5);
    } else if (this.state.filter === "End Date") {
      results = [...results].sort((a, b) => a.days_left - b.days_left);
    } else if (this.state.filter === "Most Backed") {
      results = [...results].sort((a, b) => b.num_backers - a.num_backers);
    }

    const normalizedSearchTerm = this.state.searchTerm.trim().toLowerCase();

    if (normalizedSearchTerm.length > 0) {
      results = results.filter(project =>
        this.projectMatchesKeyword(project, normalizedSearchTerm)
      );
    }

    this.setState({ filtprojects: results });
  }

  projectMatchesKeyword(project, normalizedSearchTerm) {
    const searchableFields = [
      project.title,
      project.sub_title,
      project.authorName,
      project.location,
      project.category
    ];

    return searchableFields.some(field =>
      String(field || "")
        .toLowerCase()
        .includes(normalizedSearchTerm)
    );
  }

  categoryLabelFromId(categoryId) {
    const labels = {
      1: "Arts",
      2: "Comics & Illustration",
      3: "Design & Tech",
      4: "Film",
      5: "Food & Craft",
      6: "Games",
      7: "Music",
      8: "Publishing"
    };

    if (categoryId === "" || categoryId === undefined || categoryId === null) {
      return "All Categories";
    }

    return labels[categoryId] || "All Categories";
  }

  updateSearchTerm(e) {
    const nextSearchTerm = e.currentTarget.value;
    this.setState({ searchTerm: nextSearchTerm }, () => {
      this.searchFilter(this.props.projects);
    });
  }

  update(field) {
    return e => {
      this.setState({ [field]: e.currentTarget.value });
      this.searchFilter(this.props.projects);
    };
  }

  updatedrop(cat, num) {
    this.setState(
      {
        category_id: num,
        dropdown: cat,
        catbox: "hidden",
        svg: num === "" ? "arrow" : "times"
      },
      () => this.searchFilter(this.props.projects)
    );
  }

  updateDropTwo(loc) {
    this.setState(
      {
        location: loc,
        dropdowntwo: loc,
        catboxtwo: "hidden",
        svgTwo: loc === "Earth" ? "arrow" : "times"
      },
      () => this.searchFilter(this.props.projects)
    );
  }

  updateDropThree(filter) {
    this.setState(
      {
        filter: filter,
        dropdownthree: filter,
        catboxthree: "hidden",
        svgThree: filter === "Magic" ? "arrow" : "times"
      },
      () => this.searchFilter(this.props.projects)
    );
  }

  selectCat(e) {
    if (e.currentTarget !== e.target) return;

    if (this.state.catbox === "hidden") {
      this.setState({ catbox: "cat-box-search" });
    } else {
      this.setState({ catbox: "hidden" });
    }
  }

  selectX() {
    if (this.state.catbox === "hidden") {
      this.setState({ catbox: "cat-box-search" });
    } else {
      this.setState({ catbox: "hidden" });
    }
  }

  selectLoc(e) {
    if (e.currentTarget !== e.target) return;

    if (this.state.catboxtwo === "hidden") {
      this.setState({ catboxtwo: "cat-box-search" });
    } else {
      this.setState({ catboxtwo: "hidden" });
    }
  }

  selectXTwo() {
    if (this.state.catboxtwo === "hidden") {
      this.setState({ catboxtwo: "cat-box-search" });
    } else {
      this.setState({ catboxtwo: "hidden" });
    }
  }

  selectFilt(e) {
    if (e.currentTarget !== e.target) return;

    if (this.state.catboxthree === "hidden") {
      this.setState({ catboxthree: "cat-box-search" });
    } else {
      this.setState({ catboxthree: "hidden" });
    }
  }

  selectXThree() {
    if (this.state.catboxthree === "hidden") {
      this.setState({ catboxthree: "cat-box-search" });
    } else {
      this.setState({ catboxthree: "hidden" });
    }
  }

  // this will handle the lifecycle of the projects.
  // if its non existant, we haven't fetched yet, so return null.
  // once fetched, if the array has a length, lets display each project.
  // if there is no length, return a statement letting the user know.
  checkProj() {
    if (this.state.filtprojects === "") {
      return (
        <div className="proj-and-amt">
          <div className="no-search-result">Loading...</div>
        </div>
      );
    } else {
      if (typeof this.state.filtprojects === "undefined") {
        return (
          <div className="proj-and-amt">
            <div className="proj-search-container">
              <div className="no-search-result">
                {this.state.searchTerm.trim().length > 0
                  ? `No projects matched "${this.state.searchTerm}". Try another keyword or broaden your filters.`
                  : "Oops! Looks like we couldn't find any results. Why not change some things around or broaden your search?"}
              </div>
            </div>
          </div>
        );
      } else if (this.state.filtprojects.length > 0) {
        return (
          <div className="proj-and-amt">
            <div className="proj-amt">
              Explore{" "}
              <div className="green-amt">
                &nbsp;{this.state.filtprojects.length} projects
              </div>
            </div>
            <div className="proj-search-container">
              {this.state.filtprojects.map(project => (
                <SearchIndexItem key={project.id} project={project} />
              ))}
            </div>
          </div>
        );
      } else if (this.state.filtprojects.length === 0) {
        return (
          <div className="proj-and-amt">
            <div className="proj-search-container">
              <div className="no-search-result">
                {this.state.searchTerm.trim().length > 0
                  ? `No projects matched "${this.state.searchTerm}". Try another keyword or broaden your filters.`
                  : "Oops! Looks like we couldn't find any results. Why not change some things around or broaden your search?"}
              </div>
            </div>
          </div>
        );
      }
    }
  }

  render() {
    let svgIcon;
    let svgIconTwo;
    let svgIconThree;
    if (this.state.svg === "arrow") {
      svgIcon = (
        <FontAwesomeIcon
          className="caret-svg-search"
          icon={faCaretDown}
          alt=""
          onClick={() => this.selectX()}
        />
      );
    } else if (this.state.svg === "times") {
      svgIcon = (
        <FontAwesomeIcon
          className="caret-svg-search"
          icon={faTimes}
          alt=""
          onClick={() => {
            this.updatedrop("All Categories", "");
          }}
        />
      );
    }

    if (this.state.svgTwo === "arrow") {
      svgIconTwo = (
        <FontAwesomeIcon
          className="caret-svg-search"
          icon={faCaretDown}
          alt=""
          onClick={() => this.selectXTwo()}
        />
      );
    } else if (this.state.svgTwo === "times") {
      svgIconTwo = (
        <FontAwesomeIcon
          className="caret-svg-search"
          icon={faTimes}
          alt=""
          onClick={() => {
            this.updateDropTwo("Earth");
          }}
        />
      );
    }

    if (this.state.svgThree === "arrow") {
      svgIconThree = (
        <FontAwesomeIcon
          className="caret-svg-search"
          icon={faCaretDown}
          alt=""
          onClick={() => this.selectXThree()}
        />
      );
    } else if (this.state.svgThree === "times") {
      svgIconThree = (
        <FontAwesomeIcon
          className="caret-svg-search"
          icon={faTimes}
          alt=""
          onClick={() => {
            this.updateDropThree("Magic");
          }}
        />
      );
    }

    const {
      catbox,
      catboxtwo,
      catboxthree,
      formColor,
      dropdown,
      dropdowntwo,
      dropdownthree,
      filter
    } = this.state;

    return (
      <div className="search-and-proj">
        <div className="search-container">
          <p className="search-text">Search for</p>
          <form className="search-form-container" onSubmit={e => e.preventDefault()}>
            <input
              className="search-type-input"
              type="text"
              placeholder="title, subtitle, creator, location"
              value={this.state.searchTerm}
              onChange={this.updateSearchTerm}
            />
          </form>

          <p className="search-text">Show me</p>

          <form className="dropform-search">
            <div
              className={`session-type-input-proj-drop-search ${formColor}`}
              onClick={e => this.selectCat(e)}
            >
              {dropdown}
              {svgIcon}
            </div>
            <div className={catbox}>
              <div
                onClick={() => this.updatedrop("All Categories", "")}
                className="cat-box-option"
              >
                All Categories
              </div>
              <div
                onClick={() => this.updatedrop("Arts", 1)}
                className="cat-box-option"
              >
                Arts
              </div>
              <div
                onClick={() => this.updatedrop("Comics & Illustration", 2)}
                className="cat-box-option"
              >
                Comics & Illustration
              </div>
              <div
                onClick={() => this.updatedrop("Design & Tech", 3)}
                className="cat-box-option"
              >
                Design & Tech
              </div>
              <div
                onClick={() => this.updatedrop("Film", 4)}
                className="cat-box-option"
              >
                Film
              </div>
              <div
                onClick={() => this.updatedrop("Food & Craft", 5)}
                className="cat-box-option"
              >
                Food & Craft
              </div>
              <div
                onClick={() => this.updatedrop("Games", 6)}
                className="cat-box-option"
              >
                Games
              </div>
              <div
                onClick={() => this.updatedrop("Music", 7)}
                className="cat-box-option"
              >
                Music
              </div>
              <div
                onClick={() => this.updatedrop("Publishing", 8)}
                className="cat-box-option"
              >
                Publishing
              </div>
            </div>
          </form>

          <p className="search-text">projects on</p>
          <form className="dropform-search">
            <div
              className={`session-type-input-proj-drop-search ${formColor}`}
              onClick={e => this.selectLoc(e)}
            >
              {dropdowntwo}
              {svgIconTwo}
            </div>
            <div className={catboxtwo}>
              <div
                onClick={() => this.updateDropTwo("Earth")}
                className="cat-box-option"
              >
                Earth
              </div>
              <div
                onClick={() => this.updateDropTwo("Australia")}
                className="cat-box-option"
              >
                Australia
              </div>
              <div
                onClick={() => this.updateDropTwo("Austria")}
                className="cat-box-option"
              >
                Austria
              </div>
              <div
                onClick={() => this.updateDropTwo("Belgium")}
                className="cat-box-option"
              >
                Belgium
              </div>
              <div
                onClick={() => this.updateDropTwo("Canada")}
                className="cat-box-option"
              >
                Canada
              </div>
              <div
                onClick={() => this.updateDropTwo("Denmark")}
                className="cat-box-option"
              >
                Denmark
              </div>
              <div
                onClick={() => this.updateDropTwo("France")}
                className="cat-box-option"
              >
                France
              </div>
              <div
                onClick={() => this.updateDropTwo("Germany")}
                className="cat-box-option"
              >
                Germany
              </div>
              <div
                onClick={() => this.updateDropTwo("Ireland")}
                className="cat-box-option"
              >
                Ireland
              </div>
              <div
                onClick={() => this.updateDropTwo("Italy")}
                className="cat-box-option"
              >
                Italy
              </div>
              <div
                onClick={() => this.updateDropTwo("Japan")}
                className="cat-box-option"
              >
                Japan
              </div>
              <div
                onClick={() => this.updateDropTwo("Luxembourg")}
                className="cat-box-option"
              >
                Luxembourg
              </div>
              <div
                onClick={() => this.updateDropTwo("Mexico")}
                className="cat-box-option"
              >
                Mexico
              </div>
              <div
                onClick={() => this.updateDropTwo("New Zealand")}
                className="cat-box-option"
              >
                New Zealand
              </div>
              <div
                onClick={() => this.updateDropTwo("Singapore")}
                className="cat-box-option"
              >
                Singapore
              </div>
              <div
                onClick={() => this.updateDropTwo("Spain")}
                className="cat-box-option"
              >
                Spain
              </div>
              <div
                onClick={() => this.updateDropTwo("Sweden")}
                className="cat-box-option"
              >
                Sweden
              </div>
              <div
                onClick={() => this.updateDropTwo("Switzerland")}
                className="cat-box-option"
              >
                Switzerland
              </div>
              <div
                onClick={() => this.updateDropTwo("the Netherlands")}
                className="cat-box-option"
              >
                the Netherlands
              </div>
              <div
                onClick={() => this.updateDropTwo("the United Kingdom")}
                className="cat-box-option"
              >
                the United Kingdom
              </div>
              <div
                onClick={() => this.updateDropTwo("the United States")}
                className="cat-box-option"
              >
                the United States
              </div>
            </div>
          </form>

          <p className="search-text">sorted by</p>
          <form className="dropform-search">
            <div
              className={`session-type-input-proj-drop-search ${formColor}`}
              onClick={e => this.selectFilt(e)}
            >
              {dropdownthree}
              {svgIconThree}
            </div>
            <div className={catboxthree}>
              <div
                onClick={() => this.updateDropThree("Magic")}
                className="cat-box-option"
              >
                Magic
              </div>
              <div
                onClick={() => this.updateDropThree("Projects We Love")}
                className="cat-box-option"
              >
                Projects We Love
              </div>
              <div
                onClick={() => this.updateDropThree("Newest")}
                className="cat-box-option"
              >
                Newest
              </div>
              <div
                onClick={() => this.updateDropThree("End Date")}
                className="cat-box-option"
              >
                End Date
              </div>
              <div
                onClick={() => this.updateDropThree("Most Funded")}
                className="cat-box-option"
              >
                Most Funded
              </div>
              <div
                onClick={() => this.updateDropThree("Most Backed")}
                className="cat-box-option"
              >
                Most Backed
              </div>
              <div
                onClick={() => this.updateDropThree("Random")}
                className="cat-box-option"
              >
                Random
              </div>
            </div>
          </form>
        </div>
        {this.checkProj()}
      </div>
    );
  }
}

export default withRouter(SearchIndex);
