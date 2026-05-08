import AboutHome from '../../components/aboutHome/AboutHome'
import Banner from '../../components/banner/Banner'
import Footer from '../../components/footer/Footer'
import Navbar from '../../components/Navbar/Navbar'
import OurHomeMenu from '../../components/ourHomeMenu/OurHomeMenu'
import SpecialOffer from '../../components/specialOffer/SpecialOffer'

const Home = () => {
  return (
    <>
      <Navbar />
      <Banner />
      <SpecialOffer />
      <AboutHome />
      <OurHomeMenu />
      <Footer />
    </>
  )
}

export default Home
