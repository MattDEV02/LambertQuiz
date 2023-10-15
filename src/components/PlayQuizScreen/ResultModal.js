import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../constants/theme";

const ResultModal = ({
	isModalVisible,
	correctCount,
	incorrectCount,
	totalCount,
	handleOnClose,
	handleOnRetry,
	handleOnGoHome,
}) => {
	const resultCountViewPadding = 20,
		resultCountTextFontSize = 16,
		resultCountValueFontSize = 30,
		buttonsMarginLeft = 10,
		buttonsPaddingVertical = 11,
		buttonsTextFontSize = 15,
		buttonsTextFontWeight = "500",
		iconsSize = 21;
	return (
		<Modal
			animationType={"slide"}
			transparent={true}
			visible={isModalVisible}
			onRequestClose={handleOnClose}
		>
			<View
				style={{
					flex: 1,
					backgroundColor: COLORS.black + "90",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<View
					style={{
						backgroundColor: COLORS.white,
						width: "90%",
						borderRadius: 5,
						padding: 40,
						alignItems: "center",
					}}
				>
					<Text style={{ fontSize: 28, color: COLORS.black }}>
						Results
					</Text>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<View
							style={{
								alignItems: "center",
								padding: resultCountViewPadding,
							}}
						>
							<Text
								style={{
									color: COLORS.success,
									fontSize: resultCountValueFontSize,
								}}
							>
								{correctCount}
							</Text>
							<Text style={{ fontSize: resultCountTextFontSize }}>
								Correct
							</Text>
						</View>
						<View
							style={{
								alignItems: "center",
								padding: resultCountViewPadding,
							}}
						>
							<Text
								style={{
									color: COLORS.error,
									fontSize: resultCountValueFontSize,
								}}
							>
								{incorrectCount}
							</Text>
							<Text style={{ fontSize: resultCountTextFontSize }}>
								Incorrect
							</Text>
						</View>
					</View>
					<Text style={{ opacity: 0.8, fontSize: 15 }}>
						{totalCount - (incorrectCount + correctCount)} Unattempted /{" "}
						{totalCount} Total
					</Text>

					{/* Try agian */}
					<TouchableOpacity
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							paddingVertical: buttonsPaddingVertical,
							width: "100%",
							backgroundColor: COLORS.primary,
							marginTop: 20,
							borderRadius: 50,
						}}
						onPress={handleOnRetry}
					>
						<MaterialIcons
							name="replay"
							style={{ color: COLORS.white }}
							size={iconsSize}
						/>
						<Text
							style={{
								textAlign: "center",
								color: COLORS.white,
								marginLeft: buttonsMarginLeft,
								fontSize: buttonsTextFontSize,
								fontWeight: buttonsTextFontWeight,
							}}
						>
							Try Again
						</Text>
					</TouchableOpacity>
					{/* Go Home */}
					<TouchableOpacity
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							paddingVertical: buttonsPaddingVertical,
							width: "100%",
							backgroundColor: COLORS.primary + "20",
							marginTop: 20,
							borderRadius: 50,
						}}
						onPress={handleOnGoHome}
					>
						<MaterialIcons
							name="home"
							style={{ color: COLORS.primary }}
							size={iconsSize}
						/>
						<Text
							style={{
								textAlign: "center",
								color: COLORS.primary,
								marginLeft: buttonsMarginLeft,
								fontSize: buttonsTextFontSize,
								fontWeight: buttonsTextFontWeight,
							}}
						>
							Go Home
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

export default ResultModal;
