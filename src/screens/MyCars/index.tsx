import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StatusBar } from "react-native";
import { useTheme } from "styled-components";
import { BackButton } from "../../components/BackButton";
import { Car } from "../../components/Car";
import { CarDTO } from "../../dto/Car.dto";
import { api } from "../../services/api";
import { AntDesign } from "@expo/vector-icons";

import {
    Container,
    Header,
    SubTitle,
    Title,
    Content,
    Appointments,
    AppointmentsQuantity,
    AppointmentsTitle,
    CarWrapper,
    CarFooter,
    CarFooterPeriod,
    CarFooterTitle,
    CarFooterDate,
} from "./styles";
import { Loading } from "../../components/Loading";

interface MyCarsProps {}

interface CarProps {
    car: CarDTO;
    id: string;
    user_id: string;
    startDate: string;
    endDate: string;
}

export function MyCars({}: MyCarsProps) {
    const [cars, setCars] = useState<CarProps[]>([]);
    const [loading, setLoading] = useState(true);

    const theme = useTheme();

    const navigation = useNavigation<NavigationProp<ParamListBase>>();

    function handleReturn() {
        navigation.goBack();
    }

    useEffect(() => {
        async function fetchCars() {
            try {
                const response = await api.get("schedules_byuser?user_id=1");
                setCars(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchCars();
    }, []);

    return (
        <Container>
            <Header>
                <StatusBar barStyle="light-content" translucent backgroundColor="transparent"></StatusBar>
                <BackButton onPress={handleReturn} color={theme.colors.shape}></BackButton>
                <Title>
                    Escolha uma {"\n"}data de início e {"\n"}fim do aluguel
                </Title>
                <SubTitle>Conforto segurança e praticidade</SubTitle>
            </Header>
            {loading ? (
                <Loading></Loading>
            ) : (
                <Content>
                    <Appointments>
                        <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
                        <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
                    </Appointments>
                    <FlatList
                        data={cars}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <CarWrapper>
                                <Car data={item.car}></Car>
                                <CarFooter>
                                    <CarFooterTitle>Período</CarFooterTitle>
                                    <CarFooterPeriod>
                                        <CarFooterDate>{item.startDate}</CarFooterDate>
                                        <AntDesign
                                            name="arrowright"
                                            size={20}
                                            color={theme.colors.title}
                                            style={{ marginHorizontal: 10 }}
                                        />
                                        <CarFooterDate>{item.endDate}</CarFooterDate>
                                    </CarFooterPeriod>
                                </CarFooter>
                            </CarWrapper>
                        )}
                    />
                </Content>
            )}
        </Container>
    );
}