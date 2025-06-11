//
//  SudokuKillerAppUITests.swift
//  SudokuKillerAppUITests
//
//  Created by Finbert Ngo on 2025/06/03.
//

import XCTest

final class SudokuKillerAppUITests: XCTestCase {

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.

        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    @MainActor
    func testTakeScreenshots() throws {
        // UI tests must launch the application that they test.
        let app = XCUIApplication()
        if app.state == .runningForeground || app.state == .runningBackground {
            app.terminate()
        }
        setupSnapshot(app)
        app.launch()
        sleep(2)

        // screenshot Main screen
        snapshot("01_MainScreen_LightMode")
        // ThemeButton
        var themeButton = app.descendants(matching: .any)["ThemeButton"]
        XCTAssertTrue(themeButton.waitForExistence(timeout: 2))
        themeButton.tap()
        sleep(1)
        snapshot("01_MainScreen_DarkMode")
        themeButton.tap()
        sleep(1)

        // Navigate to Statistics screen
        app.buttons["StatisticsTabButton"].tap()

        // screenshot Statistics screen
        snapshot("02_StatisticsScreen_LevelsStats_LightMode")
        themeButton = app.descendants(matching: .any)["ThemeButton"]
        XCTAssertTrue(themeButton.waitForExistence(timeout: 2))
        themeButton.tap()
        sleep(1)
        snapshot("02_StatisticsScreen_LevelsStats_DarkMode")
        themeButton.tap()
        sleep(1)

        // let chartsStatsButton = app.descendants(matching: .any)["ChartsStatsTabButton"]
        // XCTAssertTrue(chartsStatsButton.waitForExistence(timeout: 2))
        // chartsStatsButton.tap()

        // // screenshot ChartsStats screen
        // snapshot("03_StatisticsScreen_ChartsStats_LightMode")
        // themeButton = app.descendants(matching: .any)["ThemeButton"]
        // XCTAssertTrue(themeButton.waitForExistence(timeout: 2))
        // themeButton.tap()
        // sleep(1)
        // snapshot("03_StatisticsScreen_ChartsStats_DarkMode")
        // themeButton.tap()
        // sleep(1)

        // Navigate to Main screen
        app.buttons["MainTabButton"].tap()

        // Navigate to Board screen
        let newGameButton = app.descendants(matching: .any)["NewGameButton"]
        XCTAssertTrue(newGameButton.waitForExistence(timeout: 2))
        newGameButton.tap()

        sleep(1)
        let newGameButtonMaster = app.descendants(matching: .any)["NewGameButton-easy"]
        XCTAssertTrue(newGameButtonMaster.waitForExistence(timeout: 2))
        newGameButtonMaster.tap()

        // Click 3 times on the how to play next button
        sleep(5)
        for _ in 0..<3 {
            let howToPlayNextButton = app.descendants(matching: .any)["HowToPlayNextButton"]
            XCTAssertTrue(howToPlayNextButton.waitForExistence(timeout: 2))
            howToPlayNextButton.tap()
        }
      
        // screenshot Board screen
        sleep(3)
        snapshot("04_BoardScreen_LightMode")
        themeButton = app.descendants(matching: .any)["ThemeButton"]
        XCTAssertTrue(themeButton.waitForExistence(timeout: 2))
        themeButton.tap()
        sleep(1)
        snapshot("04_BoardScreen_DarkMode")
        themeButton.tap()
        sleep(1)

        // Use XCTAssert and related functions to verify your tests produce the correct results.
    }
}
