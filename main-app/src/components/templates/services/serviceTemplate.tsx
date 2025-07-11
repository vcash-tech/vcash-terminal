import { NavigateFunction } from 'react-router-dom'

import { comingSoon } from '@/assets/icons'
import Container from '@/components/atoms/container/container'
import VoucherItem from '@/components/molecules/voucherItem/voucherItem'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { serviceList } from '@/data/mocks/service.mock'
import { useTranslate } from '@/i18n/useTranslate'

import { chechLights } from '../../../assets/images'

export type ServiceTemplateProps = {
    navigate: NavigateFunction
}
export default function ServiceTemplate({ navigate }: ServiceTemplateProps) {
    const { t } = useTranslate()

    return (
        <Container isFullHeight={true}>
            <Header navigationBackText=' ' navigateBackUrl='/' />
            <div className="service-template">
                <div className="service-template__vouchers">
                    <h1>{t('service.title')}</h1>
                    <h2>{t('service.subtitle')}</h2>

                    {serviceList.map((item) => (
                        <VoucherItem
                            key={item.title}
                            title={item.title}
                            subtitle={item.subtitle}
                            image={item.image}
                            variant={item.variant as 'bet' | 'gaming'}
                            onPress={() => navigate(item.link)}
                        />
                    ))}
                </div>

                <h1>{t('service.payBills.title')}</h1>
                <h2>{t('service.payBills.body')}</h2>
                <button className="service-template__pay-bills">
                    <span className="coming-soon-badge">
                        <img src={comingSoon} />
                    </span>
                    <div className="service-template__pay-bills__content">
                        <h4>{t('service.payBills.simpleScanTitle')}</h4>
                        <p>{t('service.payBills.simpleScanBody')}</p>
                    </div>
                    <div className="service-template__pay-bills__image">
                        <img src={chechLights} alt="Check Lights" />
                    </div>
                </button>
            </div>
            <Footer />
        </Container>
    )
}
