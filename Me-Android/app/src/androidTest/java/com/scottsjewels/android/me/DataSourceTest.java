package com.scottsjewels.android.me;

import android.support.test.InstrumentationRegistry;
import android.support.test.runner.AndroidJUnit4;
import android.test.suitebuilder.annotation.LargeTest;

import com.scottsjewels.android.me.data.DataSource;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.List;

import static junit.framework.Assert.assertNotNull;
import static junit.framework.Assert.assertTrue;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;


/**
 * Tests for DataSource.
 * @see <a href="https://thedeveloperworldisyours.com/android/android-sqlite-test/">Android SQLite Tests</a>
 */
@RunWith(AndroidJUnit4.class)
@LargeTest
public class DataSourceTest {

    private DataSource mDataSource;

    @Before
    public void setUp(){
        mDataSource = DataSource.get(InstrumentationRegistry.getTargetContext());
    }

    @After
    public void finish() {
        mDataSource.close();
    }

    @Test
    public void testPreConditions() {
        assertNotNull(mDataSource);
    }

//    @Test
//    public void testShouldAddExpenseType() throws Exception {
//        mDataSource.createRate("AUD", 1.2);
//        List<Rate> rate = mDataSource.getAllRates();
//
//        assertThat(rate.size(), is(1));
//        assertTrue(rate.get(0).toString().equals("AUD"));
//        assertTrue(rate.get(0).getValue().equals(1.2));
//    }
//
//    @Test
//    public void testDeleteAll() {
//        mDataSource.deleteAll();
//        List<Rate> rate = mDataSource.getAllRates();
//
//        assertThat(rate.size(), is(0));
//    }
//
//    @Test
//    public void testDeleteOnlyOne() {
//        mDataSource.createRate("AUD", 1.2);
//        List<Rate> rate = mDataSource.getAllRates();
//
//        assertThat(rate.size(), is(1));
//
//        mDataSource.deleteRate(rate.get(0));
//        rate = mDataSource.getAllRates();
//
//        assertThat(rate.size(), is(0));
//    }
//
//    @Test
//    public void testAddAndDelete() {
//        mDataSource.deleteAll();
//        mDataSource.createRate("AUD", 1.2);
//        mDataSource.createRate("JPY", 1.993);
//        mDataSource.createRate("BGN", 1.66);
//
//        List<Rate> rate = mDataSource.getAllRates();
//        assertThat(rate.size(), is(3));
//
//        mDataSource.deleteRate(rate.get(0));
//        mDataSource.deleteRate(rate.get(1));
//
//        rate = mDataSource.getAllRates();
//        assertThat(rate.size(), is(1));
//    }
}