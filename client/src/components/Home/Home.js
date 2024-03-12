import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import { withTheme } from 'styled-components'
import AppointmentPopup from '@kornferry/kfadvance-journeys/src/Journeys/components/Scheduling/AppointmentPopup'
import { selectors as workSelectors } from '../../redux/modules/work'
import { actions as userActions } from '../../redux/modules/user-actions'
import { actions as userDocs } from '../../redux/modules/user-docs'
import { actions } from '../../redux/modules/auth'
import { actions as userProduct } from '../../redux/modules/user-product'
import PanelKfSubscription from '../PanelKfSubscription/PanelKfSubscription'
import Masthead from '../../components/Masthead/Masthead'
import Spinner from 'ui/components/Spinner'
import WebinarPanel from './WebinarPanel'
import PrysmianFlow from './PrysmianFlow'
import InsightsView from '../Insights/InsightsView'
import LivVideo from '../Insights/LivVideo'
import NextStepAction from './NextStepAction'
import FeedbackAssessmentElement from '../Assessment/FeedbackAssessmentElement'
import CoachingAssessmentElement from '../CareerCoach/CoachingAssessmentElement'
import EmailVerificationNotification from '../../components/EmailNotification/EmailVerificationNotification'
import ProductPurchased from '../../components/ProductPurchased/Purchases' //Purchases' //ProductPurchased'
import PurchasesCoaching from '../../components/ProductPurchased/PurchasesCoaching'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import SofiProductSummary from '../../components/Product/SofiProductSummary'
import SofiFinancialAdvising from '../../components/Product/SofiFinancialAdvising'
import Overview from '../../components/Goals/Overview'
import PanelKFA from '../../components/PanelKFA/PanelKFA'
import PanelKFA2 from '../../components/PanelKFA2/PanelKFA2'
import Footer from '../../components/Footer'
import RedundentPrysmian from '../../components/RedundentPrysmian/RedundentPrysmian'
import PODLearningPlan from '../../components/PODLearningPlan/PODLearningPlan'
import PanelInsights from '../../components/PanelInsights/PanelInsights'
import WestpointGradLink from '../../components/WestpointGradLink/WestpointGradLink'
import GoalsFramework from '../../components/Goals/GoalsFramework'
import MainContentMarker from '../../components/MainContentMarker'
import PromoBanner from '../../components/PromoBanner/PromoBanner'
import { getStatus } from 'lib/utility'
import { getProducts, isAvailableForCountry } from '../../shared/product-helper'
// import { Tiles, CareerWins} from "@kornferry/kfadvance_journeys/client";
import { ScrollToTopOnMount, querystring, checkForInterviewApp } from 'lib/utility'
import { H1, PH3, PH3Home } from '../../styles/common2'
import Tiles from '@kornferry/kfadvance-journeys/src/Journeys/containers/Tiles'
import Programs from '@kornferry/kfadvance-journeys/src/Journeys/containers/Programs'
import Effects from '@kornferry/kfadvance-journeys/src/Journeys/containers/Effects'
import { SignalsProvider } from 'lib/contexts/SignalsProvider'
import { actions as authActions } from "../../redux/modules/auth";
import {
  JourneysContainer,
  JourneysCareerWinsContainerWrapper,
  JourneysCareerWinsContainer,
  CareerGoalsContainer,
  JourneysActionPanelContainer,
  StyledContainer,
  StyledSidebar,
  MainContentWrapper,
  AltRightBlock,
  AltRightTextBlock,
  AltRightHeadlineBlock,
  GoalsWinsContainer,
  AdditionalContentBlock,
  Layout3MastheadContainer,
  Layout3BannerHomeImage,
  Layout3GreetingBlock,
  Layout3SupportBlock,
  GoalsWinsWrapper,
  WebinarPanelWrapper,
  FlipCardGridWrapper,
  Layout3BannerBGHomeImage,
  StepCardGridHeader,
  StepCardGridContainer,
  StepCardGridWrapper,
  StepCardGridHeaderHr,
  StepCardGridHeaderText,
  HomeBottomImageContainer,
  HomeBottomImageLeft,
  HomeBottomImageRight

} from './styles'
import Mustache from 'mustache'
import FlipCard from './FlipCard'
import StepCard from './StepCard'
import { actions as frontend } from '../../redux/modules/frontend';

/* The AlternateContentBlock replaces the Journeys Tiles section if the showAlternateContentBlock
property in the partner layout file is set to true.  Set content values in
Pages.Home.Layout2... */
import AlternateContentBlock from './AlternateContentBlock.js'
import { Redirect } from 'react-router'


class Home extends React.Component {
  static propTypes = {}
  constructor(props) {
    super(props)
    this.state = {
      isAppointmentOpen: false,
      estimatedEndDate: null
    }
    this.setFlippedFlipCardArray = []
  }

  componentDidMount() {
    const query = querystring();

    if (query && query.showproducts) {
      setTimeout(() => {
        let elem = document.getElementById('product-list');
        if (elem) {
          elem.scrollIntoView()
          window.scrollBy(0, -120);
        }
      }, 100)
    }
    const { user, refreshUserData } = this.props;
    if (this.props.user) {
      refreshUserData()
    }
    if (user?.UserKey && user?.EntityKey) {
     this.props.getAssessmentOutcome(user?.UserKey)
      getStatus({userKey: user.UserKey, entityKey: user.EntityKey })
          .then(status => {
            this.setState({ status });
            this.setState({ statusIsLoaded: true });

            if (!status) return;

            const format = 'MMM DD, YYYY';
            if (!status.endDate) {
              const values = (status.programDuration || '').split(' ');
              if (values.length === 2) {
                const interval = parseInt(values[0]);
                const unit = values[1].includes('Year') ? 'Y'
                              : values[1].includes('Month') ? 'M'
                              : values[1].includes('Week') ? 'w'
                              : values[1].includes('Day') ? 'd'
                              : '';
                this.setState({ estimatedEndDate: moment(status.startDate).add(interval, unit).format(format) });
              }
            } else {
              this.setState({ estimatedEndDate: moment(status.endDate).format(format) });
            }
          })

          const dateFormat = 'MMM DD, YYYY';
          const userMainProduct = user; //((user && (user.PurchasedProduct)) || []).filter(p=> p.MainProduct === 1);
          if(userMainProduct && (userMainProduct.IsCoachDurationExpired !== null)){
            const actualCoachDurationEndDate = (userMainProduct.ActualCoachDurationEndDate)?userMainProduct.ActualCoachDurationEndDate:null;
            const coachDurationEndDate = (userMainProduct.CoachDurationEndDate)?userMainProduct.CoachDurationEndDate:null;
            const mainProductIsCoachDurationExpired = (userMainProduct.IsCoachDurationExpired)?userMainProduct.IsCoachDurationExpired:null;

            if(userMainProduct.IsCoachDurationExpired === 1){
              this.setState({ estimatedEndDate: moment(actualCoachDurationEndDate).format(dateFormat) });
              this.setState({ isCoachDurationExpired: mainProductIsCoachDurationExpired });
            }else{
              this.setState({ estimatedEndDate: moment(coachDurationEndDate).format(dateFormat) });
              this.setState({ isCoachDurationExpired: userMainProduct.IsCoachDurationExpired });
            }
          }


    }
  }
  onAppointmentClose = () => {
    this.setState({ isAppointmentOpen: false })
  }
  onAppointmentOpen = (isOpen) => {
    this.setState({ isAppointmentOpen: isOpen })
  }
  setFlipped = (setFlippedFlipCard, cardIndex) => {
    this.setFlippedFlipCardArray[cardIndex] = setFlippedFlipCard
    this.setFlippedFlipCardArray.forEach((setFlippedFlipCard, i) => setFlippedFlipCard && setFlippedFlipCard(i === cardIndex))
  }

  render() {
    const { user, purchState, content, c, authLoading, history, access = {}, hideCareerWins, userCurrentEntityKey,
      insightsModifier, insightsTitle, insightsBlurb, noProduct, momentTZ, theme, isInterviewApp, settings, clearSelectedTool, setItem } = this.props
    if (authLoading) {
      return <Spinner />
    }
    const query = querystring();
    const { usesExperience } = this.props && this.props.settings
    const isVerified = user?.isVerified
    const isCoachAssigned = user?.isCoachAssignedForScheduling
    console.log("isCoachAssigned :",isCoachAssigned)
    if(!isCoachAssigned){
    let onboadingDetail = purchState?.purchases?.products[0]?.features.filter(o => o.productFeature ==='Onboarding')
    if (onboadingDetail) {
      onboadingDetail = onboadingDetail.reduce((o, b) => Object.assign(o, b), {})

      if (onboadingDetail.currentStep === 'complete' && isCoachAssigned === false) {
        purchState.mainNextStep.showButton = false
        purchState.mainNextStep.msgTitle = ""
        purchState.mainNextStep.msg = "OnboardingOnly"
      }
    }
  }

    const assessmentPages = theme.pages?.assessment || {}
    const imgXLarge = theme.bgHomeXL
    const imgLarge = theme.bgHome
    const imgMobile = theme.bgHomeMobile
    const firstName = user?.FirstName || null
    const homePages = theme.pages?.home || {}
    const altRightColImage = theme.homeAltRightColImage || null
    const altJourneyTopImage = theme.homeAltJourneyTopImage || null
    const hideHeroMastheadForTablet = ['Google'].includes(settings?.theme)

    const homeBottomImageLeft = theme.homeBottomLeftAnchorImage
    const homeBottomImageRight = theme.homeBottomRightAnchorImage

    const { showKFAd, showKFAd2, showKFService, showProductPurchased, showRedundentPrysmian, showWestpointLink, showPrysmianFlow, showPODLearningPlan, showInsights, showSofiServices, hasJourneys, showKFSubscriptionAd, showWebinarPanel, showAlternateContentBlock } = homePages
    let showPurchasedCoaching = homePages?.showPurchasedCoaching
    showPurchasedCoaching = purchState?.purchases?.showMenteeProducts && showPurchasedCoaching && (this.props?.settings?.showPurchasedCoaching)
    const showFeedbackElement = assessmentPages?.showFeedbackElement
    const showCoachingElementFirst = theme.pages?.home?.showCoachingElementFirst
    const hideFeedbackSection = this.props?.settings?.Home?.hideFeedbackSection || false;
    const suppressMastActionButton = theme.pages?.home?.suppressMastActionButton
    const availableServices = purchState ? purchState.services.availableServices : {}
    const freemiumOnly = purchState ? purchState.freemiumOnly : true
    const hasSubscription = purchState?.hasSubscription
    const blockSubscription = purchState ? purchState.blockSubscription : true
    const mainBlurb = content?.Pages ?
      hasSubscription ?
        content.Pages.Home.MainBlurb2 :
        content.Pages.Home.MainBlurb
      : ''


    const useLayout3 = theme?.pages?.home?.useLayout3 // flip cards and new right rail

    const allFlipCardThemeProps = theme.flipCards ? theme.flipCards : undefined
    const allStepCardThemeProps = theme.stepCards ? theme.stepCards : undefined


    const todayGreeting = (purchState && content?.Global?.Greeting[purchState.todayGreeting]) || 'Welcome'
    const nextStep = content?.NextSteps
    const products = getProducts(availableServices)
    const availableForCountry = isAvailableForCountry(products)
    const isRunningOnApp = isInterviewApp || checkForInterviewApp()
    const hideGradientOverlay = settings?.hideGradientOverlay

    // All Greeting related ContentDefs should now have {{firstName}} as part of it's value (as of 7/27/21)
    const todayGreetingLastWordBold = todayGreeting.replace('{{firstName}}', `<span class="boldest">{{firstName}}</span>`)
    const renderedGreetingLastWordBold = Mustache.render(todayGreetingLastWordBold,{firstName: firstName}) + content?.Global?.Greeting?.Punctuation
    const renderedGreeting = Mustache.render(todayGreeting,{firstName: firstName}) + content?.Global?.Greeting?.Punctuation
    // const mainLabel = `${todayGreeting}, ${firstName}${content?.Global?.Greeting?.Punctuation}`
    const mainLabelLastWordBold = renderedGreetingLastWordBold
    const mainLabel = renderedGreeting

    // const mainHeading = <span className="mastTitle">{`${todayGreeting}, ${firstName}${content?.Global?.Greeting?.Punctuation}`}</span>
    // const mainHeading = <span className="mastTitle" dangerouslySetInnerHTML={{ __html: `${todayGreeting}, ${firstName}${content?.Global?.Greeting?.Punctuation}` }} />
    const mainHeading = <span className="mastTitle mainHeading" dangerouslySetInnerHTML={{ __html: renderedGreeting }} />

    const showGreetingInLayout3Headline = theme?.pages?.home?.showGreetingInLayout3Headline
    const layout3BannerHeadline = '<span>' + (showGreetingInLayout3Headline ? renderedGreeting + ' ' + c('Pages.Home.Layout3.BannerTitle') : c('Pages.Home.Layout3.BannerTitle')) + '</span>'

    // const journeysActionPanelHeading = <span><span>{todayGreeting},&nbsp;</span><span className="boldest">{firstName}</span></span>
    //const journeysActionPanelHeading = <span><span>{renderedGreeting},&nbsp;</span></span>
    const journeysActionPanelHeading = <span>{renderedGreeting}</span>

    const nextStepAction = <NextStepAction
      {...this.props}
      isLargeMastHead={theme.mastHead === 'large'}
      hasJourneys={hasJourneys}
      mainLabel={mainLabel}
      mainLabelLastWordBold={mainLabelLastWordBold}
      // mainHeading={useLayout3 ? undefined : mainHeading}  // No greeting in sidebar for Layout3
      mainHeading={mainHeading}
      journeysActionPanelHeading={journeysActionPanelHeading}
      showFeedbackElement={showFeedbackElement && !useLayout3}  // This is needed to allow home page to show the button
      nextStep={nextStep}
      onAppointmentOpen={this.onAppointmentOpen}
      status={this.state.status}
      statusIsLoaded={this.state.statusIsLoaded}
      isParticipantLocked={this.props.isParticipantLocked}
      estimatedEndDate={this.state.estimatedEndDate}
      suppressMastActionButton={suppressMastActionButton}
      overrideTextColor={theme?.colorMastTextHome}
      isCoachDurationExpired={this.state.isCoachDurationExpired}
    />


    // This is new for Layout3
    const FlipCardGrid = () => {

      /*
        FlipCard properties and contents are defined partially in EntityContent (initially at root level),
        as follows: Pages.Home.Flipcard{CardNumber}.{PropertyName}

        The color and asset definitions reside at the top level of the theme object under the flipCards array.
        The "key" property is the match between the theme object and the set of items in EntityContent.

        Note that in the teme object, if any top-level property is overwritten at the entityLevel, the
        root object is completetly overwritten -- it is not blended. As such, if alternate theme definitions
        are required for a given entity, then build a complete definition of the flipCard object array at the
        entity level.
      */

      // Blend the properties from EntityContent and theme
      let allFlipCardContentProps = []
      for (let i=1; i < 7; i++) {
        let thisCard = {
          key: c('Pages.Home.FlipCard' + i + '.Key'),
          destination: c('Pages.Home.FlipCard' + i + '.Destination'),
          headline: c('Pages.Home.FlipCard' + i + '.Headline'),
          buttonText: c('Pages.Home.FlipCard' + i + '.ButtonText'),
          bullet1: c('Pages.Home.FlipCard' + i + '.Bullet1'),
          bullet2: c('Pages.Home.FlipCard' + i + '.Bullet2'),
          bullet3: c('Pages.Home.FlipCard' + i + '.Bullet3'),
          displayOrder: c('Pages.Home.FlipCard' + i + '.DisplayOrder'),
          target: c('Pages.Home.FlipCard' + i + '.Target'),
        }
        let thisThemeCard = allFlipCardThemeProps.find(fc => { return fc.key === thisCard.key })
        allFlipCardContentProps.push({ ...thisCard, ...thisThemeCard })
      }

      let flipCardsToDisplay = []
      if(access) {
        // Filter the flip cards to only those allowed by the given user's access rules
        let allowedItems = allFlipCardContentProps.filter(itm => {
          if(access.hasOwnProperty(itm.destination) && access[itm.destination] === 'allowed') {return itm} else {return null}
        })

        // Sort cards based on the displayOrder property as set for the given content item
        allowedItems.sort((a,b) => {
          return (isNaN(parseInt(a.displayOrder)) ? 0 : parseInt(a.displayOrder)) - (isNaN(parseInt(b.displayOrder)) ? 0 : parseInt(b.displayOrder))
        })

        // Add a sequential number for display purposes
        allowedItems = allowedItems.map((itm, idx) => {return {...itm, cardNumber: idx + 1}})

        if(Array.isArray(allowedItems) && allowedItems.length > 0) {
          allowedItems.forEach(itm => {

            // Only include the card if it is designated in the theme object. Otherwise, is should be suppressed.
            if(allFlipCardThemeProps.find(themeCard => { return themeCard.key === itm.key })) {
              flipCardsToDisplay.push(
                <FlipCard
                  key={itm.destination}
                  headline={itm.headline}
                  bullet1={itm.bullet1}
                  bullet2={itm.bullet2}
                  bullet3={itm.bullet3}
                  destination={itm.destination}
                  target={itm.target}
                  buttonText={itm.buttonText}
                  frontColor={itm.frontColor}
                  frontFontColor={itm.frontFontColor}
                  backFontColor={itm.backFontColor}
                  backColor={itm.backColor}
                  cardNumber={itm.cardNumber}
                  toRight={itm.toRight}
                  image={itm.image}
                  c={c}
                  settings={settings}
                  videoLink={(itm.videoLink ? itm.videoLink : undefined)}
                  showFlipControl
                  history={history}
                  setFlipped={this.setFlipped}
                  clearSelectedTool={clearSelectedTool}
                  setItem={setItem}
                  letterSpacing={itm.letterSpacing?itm.letterSpacing:null}
                  fontWeight={itm.fontWeight?itm.fontWeight:null}
                  fontSize={itm.fontSize?itm.fontSize:null}
                  frontFont={itm.frontFont?itm.frontFont:null}
                  marginBottom={itm.marginBottom?itm.marginBottom:null}
                  frontFontSize={itm.frontFontSize?itm.frontFontSize:null}
                  frontLineHeight={itm.frontLineHeight?itm.frontLineHeight:null}
                  />
              )
            }
          })
        }
      }

      return (
        <Grid className='flipCardGrid' container display='flex' justifyContent='center' item xs={12}>
          {flipCardsToDisplay}
        </Grid>
      )
    }

    const StepCardGrid = () => {

      const numberOfCards = (Array.isArray(allStepCardThemeProps) && allStepCardThemeProps.length > 0 ? allStepCardThemeProps.length : 0)

      let allStepCardContentProps = []
      for (let i=1; i <= numberOfCards; i++) {
        let thisCard = {
          number: i,
          numberText: c('Pages.Home.StepCard' + i + '.Number'),
          topText: c('Pages.Home.StepCard' + i + '.TopText'),
          bottomText: c('Pages.Home.StepCard' + i + '.BottomText'),
          displayOrder: c('Pages.Home.StepCard' + i + '.DisplayOrder'),
        }
        let thisThemeCard = allStepCardThemeProps.find(sc => { return sc.number === thisCard.number })
        allStepCardContentProps.push({ ...thisCard, ...thisThemeCard })
      }

      allStepCardContentProps.sort((a,b) => {
        return (isNaN(parseInt(a.displayOrder)) ? 0 : parseInt(a.displayOrder)) - (isNaN(parseInt(b.displayOrder)) ? 0 : parseInt(b.displayOrder))
      })

      let stepCardsToDisplay = []

      allStepCardContentProps.forEach(item => {
        stepCardsToDisplay.push(
          <StepCard
            key={item.number}
            number={item.number}
            numberTextColor={item.numberTextColor}
            numberBackgroundColor={item.numberBackgroundColor}
            topText={item.topText}
            topAreaTextColor={item.topAreaTextColor}
            topAreaBackgroundColor={item.topAreaBackgroundColor}
            bottomText={item.bottomText}
            bottomAreaTextColor={item.bottomAreaTextColor}
            bottomAreaBackgroundColor={item.bottomAreaBackgroundColor}
          />
        )
      })

      if(Array.isArray(stepCardsToDisplay) && stepCardsToDisplay.length > 0)
      {
        return (
          <React.Fragment>
            <StepCardGridHeader>
              <StepCardGridHeaderHr id='steps-hr'><hr /></StepCardGridHeaderHr>
                <StepCardGridHeaderText>{c('Pages.Home.StepCardHeader.Text')}</StepCardGridHeaderText>
              <StepCardGridHeaderHr id='steps-hr'><hr /></StepCardGridHeaderHr></StepCardGridHeader>
            <StepCardGridWrapper>
              <StepCardGridContainer>
                {stepCardsToDisplay}
              </StepCardGridContainer>
            </StepCardGridWrapper>
          </React.Fragment>
        )
      }

      return null
    }


    const showCareerWins = !theme.pages.home.suppressWins && !hideCareerWins;
    const showGoals = settings?.hasGoals
    let isNotEligibleForSchedulingBasedOnGoals = !user?.isEligibleForGoalBasedScheduling;
    // console.log('home.settings', settings)
    return (
      <SignalsProvider>
        {!isVerified && <EmailVerificationNotification />}

        {/* {user.isEntityProductExpired && <Redirect to="/product-expired" />} */}
        {(settings?.showPromoBanner && !hasSubscription) && <PromoBanner {...this.props} />}
        {authLoading ?
          (
            <Spinner />
          ) : usesExperience ? (
            <MainContentMarker>
              <div style={{ minHeight: '1000px' }}><Programs overrideCancelHide={this.props.overrideCancelHide} theme={theme} hideClose={true} /></div>
              <Footer purchState={purchState} theme={theme} c={c} />
            </MainContentMarker>
          ) :
            (
              <MainContentWrapper>
                <ScrollToTopOnMount />
                <MainContentMarker>

                  {(noProduct && !showAlternateContentBlock) ?
                    <Masthead
                      noProduct={noProduct}
                      backgroundXL={imgXLarge}
                      background={imgLarge}
                      mobileImg={imgMobile}
                      mobRules={{ showCover: true }}
                      theme={theme}
                      title={c('Pages.Home.HeroImage.AltText')}
                      actionPanel={nextStepAction}
                      messageWidth={6} panelWidth={6} hideGradientOverlay={hideGradientOverlay}>
                      <H1 aria-label={mainLabel}>{mainHeading}</H1>
                      <PH3Home dangerouslySetInnerHTML={{ __html: c('Pages.Home.NoProduct') }} />
                    </Masthead>
                    :
                    <>
                      {(!useLayout3 && (hasJourneys || showAlternateContentBlock)) &&
                        <JourneysContainer>
                          <Grid className="maxContent" container>
                            <Grid item xs={12} lg={theme.pages.home.suppressRightHandSideBar ? 12 : 9}>
                              {!theme.pages.home.suppressJourneysGreetingBlock &&
                                <Hidden lgUp>
                                  <JourneysActionPanelContainer className="journeysActionPanel bottomBorder 1">
                                    <div className="maxContent padded">
                                      {nextStepAction}
                                    </div>
                                  </JourneysActionPanelContainer>
                                </Hidden>
                              }
                              {showAlternateContentBlock ?
                                <AlternateContentBlock hideHeroMastheadForTablet={hideHeroMastheadForTablet} background={imgLarge} mobileBackground={imgMobile} c={c} title={c('Pages.Home.HeroImage.AltText')}
                                isRunningOnApp={isRunningOnApp} theme={theme} overrideTextColor={theme?.colorMastTextHome}/> :
                                <Tiles theme={theme} />
                              }
                            </Grid>
                            {!theme.pages.home.suppressRightHandSideBar &&
                              <Grid item xs={12} lg={3}>
                                <StyledSidebar className="sideBar" hasVisibleChildrenMobile={theme.pages.home.showAltRightHandBlock || showCareerWins || showGoals} >
                                  {theme.pages.home.showAltRightHandBlock &&
                                    <AltRightBlock>
                                      <img src={altRightColImage} alt="" />

                                      <AltRightHeadlineBlock dangerouslySetInnerHTML={{ __html: c('Pages.Home.AltRightHeadlineText') }} />
                                      <AltRightTextBlock dangerouslySetInnerHTML={{ __html: c('Pages.Home.AltRightColumnText') }} />


                                    </AltRightBlock>
                                  }
                                  {!theme.pages.home.suppressJourneysGreetingBlock &&
                                    <Hidden mdDown>
                                      <JourneysActionPanelContainer className="journeysActionPanel bottomBorder 2">
                                        <div className="maxContent padded">
                                          {nextStepAction}
                                        </div>
                                      </JourneysActionPanelContainer>
                                    </Hidden>
                                  }

                                  {showCareerWins &&
                                  <JourneysCareerWinsContainerWrapper>
                                    <JourneysCareerWinsContainer id='journeys-career-wins-container'>
                                      <Effects workflowEffectTypeKey="careerwins" />
                                    </JourneysCareerWinsContainer>
                                  </JourneysCareerWinsContainerWrapper>
                                  }

                                  {showGoals &&
                                    <CareerGoalsContainer id="career-goals-container">
                                      <Overview purchState={purchState} settings={settings} c={c} history={history} momentTZ={momentTZ} />
                                    </CareerGoalsContainer>
                                  }
                                </StyledSidebar>
                              </Grid>
                            }
                          </Grid>
                        </JourneysContainer>
                      }

                      {(!hasJourneys && !showAlternateContentBlock && !useLayout3 ) &&
                        <Masthead
                          backgroundXL={imgXLarge}
                          background={imgLarge}
                          mobileImg={imgMobile}
                          mobRules={{ showCover: true }}
                          theme={theme}
                          title={c('Pages.Home.HeroImage.AltText')}
                          actionPanel={nextStepAction}
                          messageWidth={6} panelWidth={6} hideGradientOverlay={hideGradientOverlay}>
                          <H1 aria-label={mainLabel}>{mainHeading}</H1>
                          {mainBlurb && <PH3 dangerouslySetInnerHTML={{ __html: mainBlurb }} />}
                        </Masthead>
                      }

                      {/* For all entities that will use layout3, ensure that we copy the banner text into Pages.Home.Layout3.BannerBlurb */}
                      {useLayout3 &&
                        <React.Fragment>
                          <JourneysContainer>
                          <Grid className="maxContent" container>
                            <Grid className='leftContainer' item container xs={12} md={theme.pages.home.suppressRightHandSideBar ? 12 : 9}>
                              {!theme.pages.home.suppressJourneysGreetingBlock &&
                                <Hidden mdUp>
                                  <JourneysActionPanelContainer className="journeysActionPanel bottomBorder 3">
                                    <div className="maxContent padded">
                                      {nextStepAction}
                                    </div>
                                  </JourneysActionPanelContainer>
                                </Hidden>
                              }
                              <Grid
                                className='leftTopContainer'
                                container
                                display='flex'
                                justifyContent='center'
                                item xs={12}
                              >
                                  {theme?.pages?.home?.showLayout3BackgroundBanner ? <>
                                    <Hidden smDown>
                                      <Grid item xs={12}>
                                        <Layout3BannerBGHomeImage
                                          role='img'
                                          alt={c('Pages.Home.HeroImage.AltText')}
                                          title={c('Pages.Home.HeroImage.AltText')}>
                                            <Grid item container direction='column' xs={12}>
                                            {c('Pages.Home.Layout3.BannerTitle') &&
                                              <div style={{ width: '50%' }}>
                                                <p style={{ width: '100%' }}
                                                  className="layout3-banner-title with-bgImage"
                                                  // dangerouslySetInnerHTML={{ __html: c('Pages.Home.Layout3.BannerTitle') }}
                                                  dangerouslySetInnerHTML={{ __html: layout3BannerHeadline }}

                                                />
                                                {c('Pages.Home.Layout3.BannerSubTitle') !== ' ' && <span style={{ width: '100%' }} className="layout3-banner-sub-title" dangerouslySetInnerHTML={{ __html: c('Pages.Home.Layout3.BannerSubTitle') }} />}
                                                <hr className="layout3-banner-hr with-bgImage" />
                                              </div>
                                            }
                                            <Hidden smDown>
                                              <Layout3MastheadContainer className="layout3-banner-blurb layout3-banner-blurb-only-bgImage" dangerouslySetInnerHTML={{ __html: c('Pages.Home.Layout3.BannerBlurb') }} />
                                            </Hidden>
                                            </Grid>
                                        </Layout3BannerBGHomeImage>
                                      </Grid>
                                    </Hidden>
                                    <Hidden mdUp>
                                      <Grid item container xs={12} direction='column' className='layout3-mobile-masthead-block'>
                                          <Grid item xs={12}>
                                            {c('Pages.Home.Layout3.BannerTitle') &&
                                              <div>
                                                <p className="layout3-banner-title 2" dangerouslySetInnerHTML={{ __html: layout3BannerHeadline }} />
                                                {c('Pages.Home.Layout3.BannerSubTitle') !== ' ' && <span style={{ width: '100%' }} className="layout3-banner-sub-title" dangerouslySetInnerHTML={{ __html: c('Pages.Home.Layout3.BannerSubTitle') }} />}
                                                <hr className="layout3-banner-hr" />
                                              </div>
                                            }
                                            <Layout3MastheadContainer className="layout3-banner-blurb layout3-banner-blurb-only-bgImage" dangerouslySetInnerHTML={{ __html: c('Pages.Home.Layout3.BannerBlurb') }} />
                                        </Grid>
                                      </Grid>
                                    </Hidden>
                                  </> : <>
                                    {theme.pages.home.showLayout3Banner &&
                                      <Hidden smDown>
                                        <Grid item xs={12}>
                                          <Layout3BannerHomeImage
                                            role='img'
                                            aria-label={c('Pages.Home.HeroImage.AltText')}
                                            title={c('Pages.Home.HeroImage.AltText')}
                                          />
                                        </Grid>
                                      </Hidden>
                                    }
                                    {c('Pages.Home.Layout3.BannerTitle') &&
                                      <>
                                        <p className="layout3-banner-title 3" dangerouslySetInnerHTML={{ __html: layout3BannerHeadline }} />
                                        {c('Pages.Home.Layout3.BannerSubTitle') !== ' ' && <span className="layout3-banner-sub-title" style={{backgroundColor: 'transparent'}} dangerouslySetInnerHTML={{ __html: c('Pages.Home.Layout3.BannerSubTitle') }} />}
                                        <hr className="layout3-banner-hr" />
                                      </>
                                    }
                                    {!settings.livHomeVideoPath && c('Pages.Home.Layout3.BannerBlurb') && isNotEligibleForSchedulingBasedOnGoals &&
                                      <Hidden smDown>
                                        <Layout3MastheadContainer className="layout3-banner-blurb layout3-banner-blurb-only" dangerouslySetInnerHTML={{ __html: c('Pages.Home.GoalsIncompleteBlurb') }} />
                                      </Hidden>
                                    }
                                    {!settings.livHomeVideoPath && c('Pages.Home.Layout3.BannerBlurb') && !isNotEligibleForSchedulingBasedOnGoals &&
                                      <Hidden smDown>
                                        <Layout3MastheadContainer className="layout3-banner-blurb layout3-banner-blurb-only" dangerouslySetInnerHTML={{ __html: c('Pages.Home.Layout3.BannerBlurb') }} />
                                      </Hidden>
                                    }
                                  </>}
                                <section className="layout3-banner-section">
                                  {settings.livHomeVideoPath &&
                                      <LivVideo  c={c}
                                        Modifier={settings.livHomeVideoPath}
                                        parent={'home'}
                                        logSource={'Home:/ Liv Video'}
                                        Title={c('Pages.Home.LivVideoTitle')}
                                        Blurb={c('Pages.Home.LivVideoBlurb')}
                                        ImgAlt={c('Pages.Home.LivVideoImgAlt')}
                                      />
                                  }
                                  {settings.livHomeVideoPath && !theme?.pages?.home?.showLayout3BackgroundBanner && c('Pages.Home.Layout3.BannerBlurb') &&
                                    <p className="layout3-banner-blurb2" dangerouslySetInnerHTML={{__html: c('Pages.Home.Layout3.BannerBlurb')}} />
                                  }
                                </section>
                              </Grid>
                              <Hidden smDown>
                                <FlipCardGridWrapper className='leftBottomContainer'>
                                  <FlipCardGrid />
                                </FlipCardGridWrapper>

                                <StepCardGrid />

                                {showWebinarPanel && !freemiumOnly && ((this.props.languageCode === 'en-US') || (this.props.languageCode === 'ar-SA')) && (
                                  <WebinarPanelWrapper>
                                    <WebinarPanel {...this.props} />
                                  </WebinarPanelWrapper>
                                )}
                              </Hidden>
                            </Grid>

                            {!theme.pages.home.suppressRightHandSideBar &&
                              <Grid item xs={12} md={3}>
                                <Hidden smDown>
                                <StyledSidebar className="sideBar">
                                  {theme.pages.home.showAltRightHandBlock &&
                                    <AltRightBlock>
                                      <img src={altRightColImage} alt="" />
                                      <AltRightHeadlineBlock dangerouslySetInnerHTML={{ __html: c('Pages.Home.AltRightHeadlineText') }} />
                                      <AltRightTextBlock dangerouslySetInnerHTML={{ __html: c('Pages.Home.AltRightColumnText') }} />
                                    </AltRightBlock>
                                  }
                                  {!theme.pages.home.suppressJourneysGreetingBlock &&

                                      <JourneysActionPanelContainer className={(showCareerWins || showGoals) ? 'journeysActionPanel bottomBorder 4' : 'journeysActionPanel noBottomBorder'}>
                                        <div className="maxContent padded">
                                          {nextStepAction}
                                        </div>
                                      </JourneysActionPanelContainer>

                                  }
                                  {(!theme.pages.home.suppressWins && !hideCareerWins) &&
                                    <JourneysCareerWinsContainer className='bottomBorder'>
                                      <Effects workflowEffectTypeKey="careerwins" />
                                    </JourneysCareerWinsContainer>
                                  }

                                  {settings?.hasGoals &&
                                    <CareerGoalsContainer>
                                      <Overview settings={settings} purchState={purchState} c={c} history={history} momentTZ={momentTZ} />
                                    </CareerGoalsContainer>
                                  }
                                </StyledSidebar>
                                { (access['/chat']!==undefined && access['/chat']==='allowed' && c('Pages.Home.Layout2.HaveQuestions')) && <Layout3SupportBlock className="layout-3-have-qs-md-up" dangerouslySetInnerHTML={{ __html: c('Pages.Home.Layout2.HaveQuestions') }} /> }
                            </Hidden>
                              </Grid>
                            }
                          </Grid>
                        </JourneysContainer>
                        <Hidden mdUp>
                          {showWebinarPanel && !freemiumOnly && ((this.props.languageCode === 'en-US') || (this.props.languageCode === 'ar-SA')) && (
                            <WebinarPanelWrapper>
                              <WebinarPanel {...this.props} />
                            </WebinarPanelWrapper>
                          )}
                          <FlipCardGridWrapper>
                            <FlipCardGrid />
                          </FlipCardGridWrapper>

                          <StepCardGrid />

                          <GoalsWinsWrapper>
                            {(!theme.pages.home.suppressWins && !hideCareerWins) &&
                              <JourneysCareerWinsContainer>
                                <Effects workflowEffectTypeKey="careerwins" />
                              </JourneysCareerWinsContainer>
                            }

                            {settings?.hasGoals &&
                              <CareerGoalsContainer>
                                <Overview purchState={purchState} c={c} history={history} momentTZ={momentTZ} />
                              </CareerGoalsContainer>
                            }
                          </GoalsWinsWrapper>

                          { (access['/chat']!==undefined && access['/chat']==='allowed') && <Layout3SupportBlock dangerouslySetInnerHTML={{ __html: c('Pages.Home.Layout2.HaveQuestions') }} />}
                        </Hidden>
                      </React.Fragment>
                      }

                      <StyledContainer className="pageOptions">

                        {(!showCoachingElementFirst && showFeedbackElement && !useLayout3) && <FeedbackAssessmentElement {...this.props} parent="Home" />}
                        {(!showCoachingElementFirst && showFeedbackElement && !hideFeedbackSection && !useLayout3 && (this.state.isCoachDurationExpired !== 1) && (user?.IsCoachingSessionExpired !== 1)) && <CoachingAssessmentElement {...this.props} />}

                        {(showCoachingElementFirst && showFeedbackElement && !hideFeedbackSection && !useLayout3 && (this.state.isCoachDurationExpired !== 1) && (user?.IsCoachingSessionExpired !== 1)) && <CoachingAssessmentElement {...this.props} />}
                        {(showCoachingElementFirst && showFeedbackElement && !useLayout3) && <FeedbackAssessmentElement {...this.props} parent="Home" />}

                        <PurchasesCoaching {...this.props} showPurchasedCoaching={showPurchasedCoaching} />
                        <AdditionalContentBlock dangerouslySetInnerHTML={{ __html: c('Pages.Home.AdditionalContentBlock') }} />
                        {showKFAd2 && false && <PanelKFA2 />}
                        {(!useLayout3 && settings?.hasGoals && !showAlternateContentBlock && !hasJourneys && !settings.hasSideBySideGoalsCareerWins) && <GoalsFramework c={c} history={history} purchState={purchState} defaultState='overview' theme={theme} momentTZ={momentTZ} />}
                        {!hasJourneys && !useLayout3 && settings?.hasGoals && settings.hasSideBySideGoalsCareerWins &&
                          <GoalsWinsContainer>
                            <GoalsFramework c={c} history={history} purchState={purchState} defaultState='overview' theme={theme} momentTZ={momentTZ} settings={settings} />
                            <Effects workflowEffectTypeKey="careerwins" backgroundColor={theme.lightGrayColor} />
                          </GoalsWinsContainer>
                        }
                        {showWestpointLink && <WestpointGradLink />}
                        {showPrysmianFlow && <PrysmianFlow {...this.props} />}
                        {!freemiumOnly && showProductPurchased && <ProductPurchased {...this.props} expandProduct={query && query.showproducts} />}
                        {(!useLayout3 && showWebinarPanel && !freemiumOnly && ((this.props.languageCode === 'en-US') || (this.props.languageCode === 'ar-SA')) ) && <WebinarPanel {...this.props} />}
                        {theme.pages.home.newInsights && <InsightsView c={c} Title={c(insightsTitle)} Blurb={c(insightsBlurb)} Modifier={insightsModifier} logSource={'Home:/Career Insights'} />}
                        {showPODLearningPlan && <PODLearningPlan />}
                        {showInsights && !hasSubscription && !blockSubscription && <PanelInsights theme={theme} content={content} />}
                        {showKFService && !availableForCountry && <ProductGrid products={products} summaryview hidefreeAccount freemiumOnly={freemiumOnly} c={c} />}
                        {showSofiServices && <SofiProductSummary theme={theme} purchState={purchState} />}
                        {showKFSubscriptionAd && !hasSubscription && !blockSubscription && <PanelKfSubscription theme={theme} c={c} />}
                        {showKFAd && <PanelKFA theme={theme} mode="questions" content={content} c={c} user={user} />}
                        {showRedundentPrysmian && <RedundentPrysmian />}
                        {showSofiServices && <SofiFinancialAdvising />}
                      </StyledContainer>
                    </>
                  }
                  {(homeBottomImageLeft || homeBottomImageRight) &&
                    <HomeBottomImageContainer>
                      <HomeBottomImageLeft>
                        <img src={homeBottomImageLeft} alt="" />
                      </HomeBottomImageLeft>
                      <HomeBottomImageRight>
                        <img src={homeBottomImageRight} alt="" />
                      </HomeBottomImageRight>
                    </HomeBottomImageContainer>
                  }

                </MainContentMarker>

                {!noProduct && <Footer purchState={purchState} theme={theme} c={c} />}
                <AppointmentPopup purchState={purchState?.coaching?.currentSession?.showScheduling} isOpen={this.state.isAppointmentOpen} onClose={this.onAppointmentClose} c={c} />
              </MainContentWrapper>
            )
        }
      </SignalsProvider>
    )
  }
}

const mapStateToProps = state => {
  let work = undefined
  let curStep = undefined
  let curAssessmentStep =  undefined
  const settings = state && state.settings
  if (state.auth && state.auth.products) {
    state.auth.products.forEach(product => {
      if (!curStep) {
        work = product
        curStep = workSelectors.featureByType('onboarding', product)

        // Only needed for when FeedbackAssessmentElement sits in Home rather than Assessment component
        curAssessmentStep = workSelectors.featureByType('assessment', product)
      }
    })
  }

  return {
    work,
    auth: state.auth,
    authLoading: state.auth.authLoading,
    curStep,
    access: state.access.access,
    isInterviewApp: state.auth.isInterviewApp,
    insightsModifier: state.auth.purchState.hasSubscription ? settings.insightpostbuyhome : settings.insightprebuyhome,
    insightsTitle: state.auth.purchState.hasSubscription ? 'Insights.Home.TitlePost' : 'Insights.Home.TitlePre',
    insightsBlurb: state.auth.purchState.hasSubscription ? 'Insights.Home.BlurbPost' : 'Insights.Home.BlurbPre',
    noProduct: state.auth && state.auth.purchState ? state.auth.purchState.hasNoProduct : true,
    languageCode: state.auth.user.LanguageCode ? state.auth.user.LanguageCode : 'en-US',
    lastReportsReceivedTime: state.mqtt.lastReportsReceivedTime,
    assessmentStatus: state.mqtt.assessmentStatus,
    curAssessmentStep,
    hideCareerWins: settings?.Home?.hideCareerWins || false,

    buyingProduct: state.userProduct.buyingProduct,
    overrideCancelHide: state.settings?.OverrideCancelHide,
    userCurrentEntityKey: state.auth.entityContext?.[0],
    isParticipantLocked: state.auth.isParticipantLocked
    // getTopTools: menus => menus?.topTools
    // ? state.access.resourceGroups[menus.topTools]
    // : state.access.resourceGroups['group:top_tools'],

  }
}

const mapDispatchToProps = dispatch => ({
  scheduleCoachingAppointment: (coachId, schedulePayload, pushStepPayload) =>
    dispatch(userActions.scheduleCoachingAppointment(coachId, schedulePayload, pushStepPayload)),
    
  getAssessmentOutcome: (userKey)  =>
    dispatch(actions.getAssessmentOutcome(userKey)),
  scheduleAutoCoachingAppointment: (coachID, scheduleData, pushData) =>
    dispatch(userActions.scheduleAutoCoachingAppointment(coachID, scheduleData, pushData)),
  scheduleOutlookAppointment: (coachId, schedulePayload, pushStepPayload) =>
    dispatch(userActions.scheduleOutlookAppointment(coachId, schedulePayload, pushStepPayload)),
  rescheduleCoachingAppointment: (appointmentKey, coachId, schedulePayload, pushStepPayload) =>
    dispatch(userActions.rescheduleCoachingAppointment(appointmentKey, coachId, schedulePayload, pushStepPayload)),
  cancelAppointment: AppointmentKey => dispatch(userActions.cancelAppointment(AppointmentKey)),
  uploadUserDocs: (userKey, postData) => dispatch(userDocs.uploadUserDocs(userKey, postData)),
  navToAppointment: (itemKey, button) => dispatch(actions.navToAppointment(itemKey, button)),
  buyAProduct: (productCode, price) => dispatch(userProduct.buyAProduct(productCode, price)),
  buyProductStart: () => dispatch(userProduct.buyProductStart()),
  clearSelectedTool: () => dispatch(frontend.TopTools.clearSelected()),
  setItem: (group, key, value) => dispatch(frontend.setItem(group, key, value)),
  refreshUserData: (user) => dispatch(authActions.refreshUserData()),
})




// export default connect(mapStateToProps)(Home)
export default withTheme(connect(mapStateToProps, mapDispatchToProps)(Home))
