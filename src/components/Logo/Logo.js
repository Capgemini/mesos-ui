import React, { PropTypes } from 'react';

class Logo extends React.Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    styles: PropTypes.object
  };

  static defaultProps = {
    height: 256,
    width: 291,
    styles: {
      backColour: '#FFFFFF',
      fillColour: '#00AEDE'
    }
  };

  logoStyles() {
    let styles = {
      'root': {
        backgroundColor: '#004561'
      },
      'svg': {
        padding: '10px 0 4px 13px'
      }
    };
    return styles;
  };

  render() {
    let props = this.props;
    let styles = props.styles;
    let logoStyles = this.logoStyles();
    let viewBox = '0 0 256 291';

    return (
     <div style={logoStyles.root}>
       <svg style={logoStyles.svg} width={props.width} height={props.height} viewBox={viewBox} preserveAspectRatio="xMidYMid" role="img" aria-label="Mesos logo">
         <title>Mesos UI</title>
         <g>
           <path d="M190.180109,177.16993 L190.180109,113.804451 L135.537556,145.539486 L190.180109,177.16993" fill={styles.backColour}></path>
           <path d="M186.644918,107.621603 L131.906739,75.9702412 L131.906739,139.348669 L186.644918,107.621603" fill={styles.fillColour}></path>
           <path d="M124.792529,139.346677 L124.792529,75.968249 L70.0155019,107.619611 L124.792529,139.346677" fill={styles.fillColour}></path>
           <path d="M121.252358,69.8870039 L66.5271284,38.052358 L66.5271284,101.52442 L121.252358,69.8870039" fill={styles.fillColour}></path>
           <path d="M186.644918,183.259144 L131.906739,151.635673 L131.906739,215.00414 L186.644918,183.259144" fill={styles.backColour}></path>
           <path d="M124.792529,215.005136 L124.792529,151.633681 L70.0155019,183.261136 L124.792529,215.005136" fill={styles.backColour}></path>
           <path d="M252.113183,145.53849 L197.295315,113.80744 L197.295315,177.168934 L252.113183,145.53849" fill={styles.fillColour}></path>
           <path d="M59.3989728,101.52442 L59.3989728,38.052358 L4.2633463,69.8870039 L59.3989728,101.52442" fill={styles.fillColour}></path>
           <path d="M121.252358,221.095346 L66.5271284,189.375253 L66.5271284,252.826397 L121.252358,221.095346" fill={styles.backColour}></path>
           <path d="M59.3989728,252.827393 L59.3989728,189.377245 L4.2633463,221.097339 L59.3989728,252.827393" fill={styles.fillColour}></path>
           <path d="M121.252358,145.53849 L66.5271284,113.80744 L66.5271284,177.168934 L121.252358,145.53849" fill={styles.backColour}></path>
           <path d="M190.180109,101.52442 L190.180109,38.052358 L135.537556,69.8870039 L190.180109,101.52442" fill={styles.fillColour}></path>
           <path d="M131.908732,0.318754864 L131.908732,63.6762646 L186.646911,31.9561712 L131.908732,0.318754864" fill={styles.backColour}></path>
           <path d="M70.0145058,31.9561712 L124.791533,63.6762646 L124.791533,0.318754864 L70.0145058,31.9561712" fill={styles.backColour}></path>
           <path d="M186.644918,258.91063 L131.906739,227.294132 L131.906739,290.641681 L186.644918,258.91063" fill={styles.backColour}></path>
           <path d="M124.792529,290.643673 L124.792529,227.29214 L70.0155019,258.912623 L124.792529,290.643673" fill={styles.backColour}></path>
           <path d="M255.660327,215.005136 L255.660327,151.633681 L200.983907,183.261136 L255.660327,215.005136" fill={styles.fillColour}></path>
           <path d="M59.3989728,177.16993 L59.3989728,113.70484 L4.2633463,145.539486 L59.3989728,177.16993" fill={styles.fillColour}></path>
           <path d="M55.871751,183.259144 L0.656435798,151.635673 L0.656435798,215.00414 L55.871751,183.259144" fill={styles.fillColour}></path>
           <path d="M255.660327,139.346677 L255.660327,75.968249 L200.983907,107.619611 L255.660327,139.346677" fill={styles.fillColour}></path>
           <path d="M252.113183,69.8870039 L197.295315,38.052358 L197.295315,101.52442 L252.113183,69.8870039" fill={styles.fillColour}></path>
           <path d="M252.113183,221.095346 L197.295315,189.375253 L197.295315,252.826397 L252.113183,221.095346" fill={styles.fillColour}></path>
           <path d="M190.180109,252.827393 L190.180109,189.377245 L135.537556,221.097339 L190.180109,252.827393" fill={styles.backColour}></path>
           <path d="M55.871751,107.621603 L0.656435798,75.9702412 L0.656435798,139.348669 L55.871751,107.621603" fill={styles.fillColour}></path>
         </g>
       </svg>
     </div>
    );
  }
}

export default Logo;
