const {
  Paper,
  FloatingActionButton,
  FontIcon
} = mui


pmc.floatButton = React.createClass({

  getInitialState() {
    return({
      showDockBtn: true,
      showDockItems: false,
      items: this.props.items.length,
      left: this.props.left,
      icon: (this.props.icon == undefined) ? 'add' : this.props.icon
    })
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },

  componentWillMount() {
    if(this.state.items > 6){
      throw('Number of menu items cannot be greater than 6!')
    }
  },
  componentDidMount(){
    let dockBtn = this.refs.hideDock.getDOMNode()
    let self = this
    $(dockBtn).focusout('',function(){
      self.setState({
        showDockItems: false
      })
    })

  },

  _handleDockClick(e) {
    let self = this;
    this.setState({
      showDockItems: !this.state.showDockItems
    })

    this.props.items.map(function(item, index){
      let icon = $(self.getDOMNode())[0].children[0].children[index];
      let top = screen.height - 175;
      let topPos = self.state.showDockItems ? top : (top - ((index+1)*80));
      $(icon).velocity({
        top: topPos,
        opacity: 1,
      },{
        duration: 150,
        'display':'block',
        easing: "easeOutExpo"
      })
    })
  },
  _menuClick(action){
    this._handleDockClick()
    action()
  },
  render() {
    let top = screen.height - 175;
    let styles ={
      overlay: {
        'position':'fixed',
        'backgroundColor':'rgba(255,255,255,0.9)',
        'zIndex': '9999',
        'width':'100%',
        'height':'100%',
        'top':'0px',
        'opacity':'1'
      },
      hideOverlay: {
        'zIndex': '999',
        'display':'none',
        'opacity':'0',
        'width':'100%',
        'height':'100vh',
      },
      left: {
        'position':'absolute',
        'top':top,
        'fontSize':'39px',
        'color':'#aeaeae',
        'left':'28px',
      },
      right: {
        'position':'absolute',
        'top':top,
        'fontSize':'39px',
        'color':'#aeaeae',
        'right':'28px',
      },
      leftMenuItems: {
        'position':'absolute',
        'top':top,
        'left':'28px',
        'opacity':'0',
        'display':'none'
      },
      rightMenuItems: {
        'position':'absolute',
        'top':top,
        'right':'20px',
        'opacity':'0',
        'display':'none'
      },
      spanLeft: {
        'float':'right',
        'marginLeft':'20px',
        'marginTop':'15px'
      },
      spanRight: {
        'float':'left',
        'marginRight':'20px',
        'marginTop':'15px'
      }
    }
    let overlay = (this.state.showDockItems) ? styles.overlay : styles.hideOverlay;
    return(
      <div>

        {/* Overlay and menu buttons */}
        <Paper refs='overlay' zDepth={3} style={overlay} >
          {
            this.props.items.map(function(item, index){
              let icon = <FontIcon className="material-icons">{item.icon}</FontIcon>;
              if(item.customIcon){
                icon = <img className='customIcon' src={item.customURL} />;
              }
              return <div key={index} style={(this.state.left == undefined) ? styles.rightMenuItems : styles.leftMenuItems}>
                <span style={(this.state.left == undefined) ? styles.spanRight : styles.spanLeft}>{item.label}</span>
                <FloatingActionButton
                  linkButton={true}
                  onClick={this._menuClick.bind(this, item.action)}
                  >
                  {icon}
              </FloatingActionButton></div>
              }.bind(this))
          }

            <FontIcon
            onClick={this._handleDockClick}
            ref='hideDock'
            style={(this.state.left == undefined) ? styles.right : styles.left }
              className="material-icons hideDock">cancel</FontIcon>
        </Paper>
        {/**** End Overlay ***/}

        {/* Dock button stuffs below */}
        <FloatingActionButton backgroundColor={"#c0f948"} className='dock'
          style={(this.state.left == undefined) ? styles.right : styles.left }
          onClick={this._handleDockClick}>
          <FontIcon className="material-icons">{this.state.icon}</FontIcon>
        </FloatingActionButton>
      </div>
    )
  }
})
